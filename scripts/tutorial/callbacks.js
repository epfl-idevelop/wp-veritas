/**
 * Le but de cet exemple est de montrer comment exécuter 
 * "séquentiellement" 2 actions asynchrones avec des callbacks.
 * 
 * Pour cela on est obligé d'imbriquer les callbacks.
 * => On parle de l'enfer des callbacks
 */

/**
 * Définition de la méthode get().
 * 
 * Cette méthode asynchrone permet d'interroger l'API 
 * en fonction de l'URL donné en paramètre
 * 
 * @param {*} url: URL de l'api à appeler
 * @param {*} success: en cas de succès, on retourne le résultat de l'appel à l'API
 * @param {*} error: en cas d'erreur , on retourne l'erreur
 */
var get = function (url, success, error) {
  var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        success(xhr.responseText)
      } else {
        error(xhr)
      }   
    }
  }
  xhr.open('GET', url, true)
  xhr.send()
}

/**
 * Définition de la méthode getPosts().
 * 
 * Cette méthode est asynchrone et returne en cas de succès
 * tous les articles du 1er utilisateur
 * 
 * @param {*} success: En cas de succès, on retourne les articles du 1er user.
 * @param {*} error: En cas d'erreur, on affiche l'erreur.
 */
var getPosts = function(success, error) {

  // 1er appel asynchrone pour obtenir la liste des users
  // Cet appel a en paramètre 2 fonctions de callbacks
  get('https://jsonplaceholder.typicode.com/users', function (response) {

    var users = JSON.parse(response);

    // 2ème appel asynchrone pour obtenir la listes des articles du 1er user
    // Cet appel a en paramètre 2 fonctions de callbacks
    // Pour pouvoir avoir la liste des users, on fait l'appel à l'intérieur de la fonction
    // de callback
    get('https://jsonplaceholder.typicode.com/comments?userId=' + users[0].id, function (response) {

      var posts = JSON.parse(response);
      
      // en cas de succès on retourne la liste des posts du 1er user 
      success(posts);

    }, function (e) {
      // en cas d'erreur, on affiche l'erreur
      error(e);
    })
    
  }, function (e) {
    // en cas d'erreur, on affiche l'erreur
    error(e);
  })
}

// Appel de la fonction getPosts
// en lui passant 2 fonctions de callback
// - la 1ère en cas de succès 
// - la deuxième en cad d'erreur
getPosts(function(posts) {

  // en cas de succès, j'affiche le 1er post
  console.log("Le premier post: ", posts[0]);
}, function(error) {

  // en cas d'erreur, j'affiche l'erreur
  console.error(error);
})