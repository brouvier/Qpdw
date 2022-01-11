<?php

/* Création d'une session commune à tous les utilisateurs de l'API */
session_id('globalSessionId');
if(!session_start()){
	throw new Exception('Impossible de démarrer la session');
}

$QUEUE_NAME = 'messageQueue';

/**
 * Initialisation de la pile si elle n'est pas déjà présente dans la session
 */
function initQueue(){
	if(!isset($_SESSION[$QUEUE_NAME])) {
		$_SESSION[$QUEUE_NAME] = array();
	}
}

/**
 * Vide totalement la pile
 */
function clear(){
	$_SESSION[$QUEUE_NAME] = array();
};

/**
 * Ajout d'une élément dans la pile des messages
 */
function push($cmd, $param1 = null, $param2 = null){
	initQueue();

	$newMessage = '{"cmd": "'.$cmd.'"';
	if($param1 != null) {
		$newMessage = $newMessage.', "param": "'.$param1.'"';
	}
	if($param2 != null) {
		$newMessage = $newMessage.', "param2": "'.$param2.'"';
	}
	array_push($_SESSION[$QUEUE_NAME], $newMessage);
};

/**
 * Récupération du premier élement de la pile
 */
function shift(){
	initQueue();
	if(count($_SESSION[$QUEUE_NAME]) > 0){
		$message = array_shift($_SESSION[$QUEUE_NAME]);
		$qSize = count($_SESSION[$QUEUE_NAME]);
		echo $message.', "queueSize": '.$qSize.'}';
	}
};

/**
 * Retoune la pile
 */
function queueState(){
	initQueue();

	echo json_encode($_SESSION[$QUEUE_NAME]);
};

