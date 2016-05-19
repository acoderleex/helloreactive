'use strict';
import React, { Component } from 'react';
import {
  AsyncStorage,
}from 'react-native';

//Url
var API_COVER_URL="http://news-at.zhihu.com/api/4/start-image/1080*1776";

//Key word
var KEY_COVER='@Cover';

function parseDateFromYYYYMMdd(str){
  if (!str)
      return new Date();
  return new Date(str.slice(0,4),str.slice(4,6)-1,str.slice(6,8));
}

Date.prototype.yyyymmdd = function () {
  var yyyy=this.getFullYear().toString();
  var mm=(this.getMonth()+1).toString();
  var dd=this.getDate().toString();
  return yyyy + (mm[1]?mm:"0"+mm[0]) + (dd[1]?dd:"0"+dd[0]); // padding
};

//Singleton Pattern
function DataResponsitory(){
  if (typeof DataResponsitory.instance==='object') {
    return DataResponsitory.instance;
  }
  DataResponsitory.instance=this;
}
//Methods
DataResponsitory.prototype.getCover = function () {
  return this._safeStorage(KEY_COVER);
};

DataResponsitory.prototype.updateCover = function () {
    fetch(API_COVER_URL)
    .then((response)=>response.json())
    .then((responseData)=>{
      AsyncStorage.setItem(KEY_COVER,JSON.stringify(responseData));
    })
    .catch((error)=>{
      console.error(error);
    })
    .done();
};


//Methods implementation
DataResponsitory.prototype._safeStorage = function (key:string) {
  return new Promise(
      (resolve,reject)=>{
          AsyncStorage.getItem(key,(error,result)=>{
            var rectData=JSON.parse(result);
            if (error) {
              console.error(error);
              resolve(null);
            }else {
              resolve(rectData);
            }
          });
      }
  );
};

module.exports= DataResponsitory;
