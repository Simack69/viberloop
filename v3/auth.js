(function() {
  'use strict';

  var VALID_ROLES = [
    'WASTE_SOURCE', 'RECYCLING_HUB', 'SPINNER', 'WEAVER',
    'MANUFACTURING', 'POL', 'POD', 'DISTRIBUTION_CENTER', 'ADMIN'
  ];

  var VALID_STATUSES = ['active', 'pending', 'disabled'];

  var _auth = null;
  var _db = null;
  var _currentUser = null;
  var _currentProfile = null;
  var _listeners = [];
  var _unsubscribeAuth = null;

  function _notifyListeners() {
    var user = getCurrentUser();
    for (var i = 0; i < _listeners.length; i++) {
      try { _listeners[i](user); } catch (e) { console.error('Auth listener error:', e); }
    }
  }

  function _fetchProfile(uid) {
    return _db.ref('users/' + uid).once('value').then(function(snapshot) {
      return snapshot.val();
    });
  }

  function _writeProfile(uid, data) {
    return _db.ref('users/' + uid).set(data);
  }

  function _updateProfile(uid, updates) {
    return _db.ref('users/' + uid).update(updates);
  }

  function init(firebaseApp) {
    _auth = firebaseApp.auth();
    _db = firebaseApp.database();

    return new Promise(function(resolve) {
      _unsubscribeAuth = _auth.onAuthStateChanged(function(firebaseUser) {
        if (firebaseUser) {
          _currentUser = firebaseUser;
          _fetchProfile(firebaseUser.uid).then(function(profile) {
            _currentProfile = profile || null;
            _notifyListeners();
            resolve();
          }).catch(function(err) {
            console.error('Failed to fetch user profile:', err);
            _currentProfile = null;
            _notifyListeners();
            resolve();
          });
        } else {
          _currentUser = null;
          _currentProfile = null;
          _notifyListeners();
          resolve();
        }
      });
    });
  }

  function login(email, password) {
    if (!_auth) { return Promise.reject(new Error('Auth not initialized')); }
    return _auth.signInWithEmailAndPassword(email, password).then(function(credential) {
      _currentUser = credential.user;
      return _fetchProfile(credential.user.uid).then(function(profile) {
        if (!profile) {
          return _auth.signOut().then(function() {
            _currentUser = null;
            _currentProfile = null;
            throw new Error('No user profile found. Contact an administrator.');
          });
        }
        if (profile.status === 'disabled') {
          return _auth.signOut().then(function() {
            _currentUser = null;
            _currentProfile = null;
            throw new Error('Account is disabled. Contact an administrator.');
          });
        }
        _currentProfile = profile;
        _updateProfile(credential.user.uid, {
          lastLoginAt: firebase.database.ServerValue.TIMESTAMP
        });
        _notifyListeners();
        return getCurrentUser();
      });
    });
  }

  function register(email, password, displayName) {
    if (!_auth) { return Promise.reject(new Error('Auth not initialized')); }
    return _auth.createUserWithEmailAndPassword(email, password).then(function(credential) {
      var profile = {
        email: email,
        displayName: displayName || '',
        role: 'PENDING',
        status: 'pending',
        createdAt: firebase.database.ServerValue.TIMESTAMP,
        lastLoginAt: firebase.database.ServerValue.TIMESTAMP
      };
      return _writeProfile(credential.user.uid, profile).then(function() {
        if (displayName) {
          return credential.user.updateProfile({ displayName: displayName });
        }
      }).then(function() {
        _currentUser = credential.user;
        _currentProfile = profile;
        _notifyListeners();
        return getCurrentUser();
      });
    });
  }

  function logout() {
    if (!_auth) { return Promise.reject(new Error('Auth not initialized')); }
    return _auth.signOut().then(function() {
      _currentUser = null;
      _currentProfile = null;
      _notifyListeners();
    });
  }

  function getCurrentUser() {
    if (!_currentUser || !_currentProfile) { return null; }
    return {
      uid: _currentUser.uid,
      email: _currentUser.email || '',
      displayName: _currentProfile.displayName || _currentUser.displayName || '',
      role: _currentProfile.role || 'PENDING',
      status: _currentProfile.status || 'pending'
    };
  }

  function isAdmin() {
    return _currentProfile !== null && _currentProfile.role === 'ADMIN';
  }

  function hasRole(role) {
    return _currentProfile !== null && _currentProfile.role === role;
  }

  function requireAuth(callback) {
    var user = getCurrentUser();
    if (user) {
      callback(user);
    } else {
      window.location.href = '/v3/';
    }
  }

  function onAuthChanged(callback) {
    if (typeof callback !== 'function') { return; }
    _listeners.push(callback);
    if (_currentUser !== undefined) {
      try { callback(getCurrentUser()); } catch (e) { console.error('Auth listener error:', e); }
    }
  }

  window.ViberloopAuth = {
    VALID_ROLES: VALID_ROLES,
    VALID_STATUSES: VALID_STATUSES,
    init: init,
    login: login,
    register: register,
    logout: logout,
    getCurrentUser: getCurrentUser,
    isAdmin: isAdmin,
    hasRole: hasRole,
    requireAuth: requireAuth,
    onAuthChanged: onAuthChanged
  };
})();
