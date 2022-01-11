<?php

/**
 * Excécute une requête SQL et retourne un tableau de résulat
 * Si $allowEmpty est faux, retourne une erreur si le résultat est vide
 */
function runQuery($query, $allowEmpty, $params = [], $dbServerName = 'lrsql002'){
	try { // Connexion à la base
		$c = new PDO("sqlsrv:Server=$dbServerName;Database=Indigo", "lrsql", "SqlLr$");
	} catch (Exception $e) {
		throw new Exception("Database connection failed : " . $e->getMessage() . "\n" . $e->getTraceAsString());
    }

    // Exécution de la requête
	$stmt = $c->prepare($query);
	$stmt->execute($params);
	$result = $stmt->fetchAll(PDO::FETCH_ASSOC);
	unset($c); unset($stmt);

    // Contrôle du résultat
	if(sizeof($result) != 0) {
		return $result;
	} elseif($allowEmpty) {
        return [];
     } else {
		throw new Exception('Query result is empty');
	}
}

/**
 * Excécute une requête SQL et retourne un unique objet
 * Soulève une exception si le résultat ne fait pas exactement une ligne
 */
function firstLine($result){
	if(sizeof($result) == 1) {
		return $result[0];
     } else {
		throw new Exception('Result return multi line');
	}
}

/**
 * Contrôle les paramètrs d'une fonction d'un contrôleur
 */
function checkParam($paramName, $paramValue, $pattern){
    $paramValue = htmlspecialchars($paramValue);

	if(!preg_match($pattern, $paramValue)) {
		throw new Exception("$paramName value [$paramValue] dont match with $pattern");
	}

    return $paramValue;
}