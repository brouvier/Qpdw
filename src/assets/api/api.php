<?php

require_once('core/router.php');
require_once('common/util.php');
require_once('controler/queueControler.php');

class API
{
    //Input datas
    private $_URI;          //URI - /password/cat/id
    private $_method;       //GET - POST - PUT - DELETE
    private $_rawInput;     //Raw input


    function __construct($inputs)
    {
        //HTTP inputs
        $this->_URI =       $this->_checkKey('URI', $inputs);
        $this->_rawInput =  $this->_checkKey('raw_input', $inputs);
        $this->_method =    $this->_checkKey('method', $inputs);
    }

    //Return NULL if the key does not exist
    private function _checkKey($key, $array){
        return array_key_exists($key, $array) ? $array[$key] : NULL;
    }

    public function run() {

        //Create the router
        $router = new Router();

        // Populate the router

        // Queue
        $router->addRoute('GET', '/clear', function() { clear(); });
        $router->addRoute('GET', '/push/:cmd', function($cmd) { push($cmd); });
        $router->addRoute('GET', '/push/:cmd/:param', function($cmd, $param) { push($cmd, $param); });
        $router->addRoute('GET', '/push/:cmd/:param1/:param2', function($cmd, $param1, $param2) { push($cmd, $param1, $param2); });
        $router->addRoute('GET', '/shift', function() { shift(); });
        $router->addRoute('GET', '/queueState', function() { queueState(); });


        // Route par défaut
        $router->setDefaultRoute('default');
        $router->addRoute('GET', '/default', function(){
            throw new Exception("Route inconue");
        });

        //Run the router
        try {
            $router->run($this->_method, $this->_URI);
        } catch (Exception $e) {
            echo '{"error" : "' . $e->getMessage() . '"}';
        }
    }
}
