"use strict";

angular
  .module("superApp", [
    "ui.router",
    "ngResource"
  ])
  .config([
    "$stateProvider",
    RouterFunction
  ])
  .factory("ActivityFactory", [
    "$resource",
    ActivityFactoryFunction
  ])
  .factory("PeopleFactory", function( $resource){
    return $resource ("http://localhost:3000/activities/:activity_id/people/:id", {}, {
        update: {method: "PUT"},
      });
  })
  .controller("ActivityIndexController", [
    "ActivityFactory",
    ActivityIndexControllerFunction
  ])
  .controller( "ActivityNewController", [
    "ActivityFactory",
    "$state",
    ActivityNewControllerFunction
  ])
  .controller("ActivityShowController", [
    "ActivityFactory",
    "PeopleFactory",
    "$stateParams",
    ActivityShowControllerFunction
  ])
  .controller( "ActivityEditController", [
    "ActivityFactory",
    "$stateParams",
    "$state",
    ActivityEditControllerFunction
  ])
  .controller("PersonNewController", [
    "PeopleFactory",
    "$stateParams",
    "$state",
    PersonNewControllerFunction
  ])
  .controller("PersonEditController", [
    "PeopleFactory",
    "$stateParams",
    "$state",
    PersonEditControllerFunction
  ])

  function RouterFunction( $stateProvider){
    $stateProvider
      .state("activityIndex", {
        url: "",
        templateUrl: "ng-views/index.html",
        controller: "ActivityIndexController",
        controllerAs: "vm"
      })
      .state( "activityNew", {
        url: "/activities/new",
        templateUrl: "ng-views/new.html",
        controller: "ActivityNewController",
        controllerAs: "vm"
      })
      .state( "activityShow", {
        url: "/activities/:id",
        templateUrl: "ng-views/show.html",
        controller: "ActivityShowController",
        controllerAs: "vm"
      })
      .state( "activityEdit", {
        url: "/activities/:id/edit",
        templateUrl: "ng-views/edit.html",
        controller: "ActivityEditController",
        controllerAs: "vm"
      })
      .state("personNew", {
        url: "/activities/:activity_id/people/new",
        templateUrl: "ng-views/person_new.html",
        controller: "PersonNewController",
        controllerAs: "vm"
      })
      .state("personEdit", {
        url: "/activities/:activity_id/people/:id/edit",
        templateUrl: "ng-views/person_edit.html",
        controller: "PersonEditController",
        controllerAs: "vm"
      });
  }

  function ActivityFactoryFunction( $resource){
    return  $resource( "http://localhost:3000/activities/:id ", {}, {
        update: { method: "PUT" },
      });
  }
  function ActivityIndexControllerFunction( ActivityFactory, $state){
    this.activities = ActivityFactory.query()
  }
  function ActivityNewControllerFunction( ActivityFactory, $state){
    this.activity = new ActivityFactory()
    this.create = function(){
      this.activity.$save(function( activity) {
        $state.go("activityIndex");
      });
    };
  }
  function ActivityShowControllerFunction( ActivityFactory, PeopleFactory, $stateParams){
    this.activity = ActivityFactory.get( {id: $stateParams.id});
    this.people = PeopleFactory.query( {activity_id: $stateParams.id});
 }
  function ActivityEditControllerFunction( ActivityFactory, $stateParams , $state){
    this.activity = ActivityFactory.get( {id: $stateParams.id});
    this.update = function(){
      this.activity.$update( {id: $stateParams.id},
        function( activity) {
        $state.go( "activityShow", {id: activity.id});
      });
  };
    this.destroy = function(){
      this.activity.$delete( {id: $stateParams.id},
        function( activity){
          $state.go( "activityIndex");
        });
    };
}
  }
function PersonNewControllerFunction(PeopleFactory, $stateParams, $state) {
  this.person = new PeopleFactory()
  this.create = function(){
    this.person.activity_id = $stateParams.activity_id
    this.person.$save({activity_id: $stateParams.activity_id},
      function(activity) {
      $state.go("activityShow", {id: $stateParams.activity_id})
    });
  };
}

function PersonEditControllerFunction( PeopleFactory, $stateParams, $state) {
  this.person = PeopleFactory.get({activity_id: $stateParams.activity_id, id: $stateParams.id})
  this.update = function(){
    this.person.$update( {activity_id: $stateParams.activity_id, id: $stateParams.id},
      function( person) {
      $state.go( "activityShow", {id: person.activity_id})
    });
  }
  this.destroy = function(){
    this.person.$delete( {activity_id: $stateParams.activity_id, id: $stateParams.id},
      function( person){
      $state.go( "activityShow", {id: $stateParams.activity_id})
    });
  }
}
