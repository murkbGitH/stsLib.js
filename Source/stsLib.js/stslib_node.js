﻿/*----------------------------------------
stsLib.js
Standard Software Library JavaScript
----------------------------------------
ModuleName:     node.js Module
FileName:       stslib_node.js
----------------------------------------
License:        MIT License
All Right Reserved:
    Name:       Standard Software
    URL:        https://www.facebook.com/stndardsoftware/
--------------------------------------
version:        2018/02/05
//----------------------------------------*/

//----------------------------------------
//■全体を囲う無名関数
//----------------------------------------
(function() {

  //----------------------------------------
  //・require実行
  //----------------------------------------
  var stsLib = require('./stslib_console.js')

  const fs = require('fs');
  const path = require('path');

  //----------------------------------------
  //■stsLib名前空間
  //----------------------------------------
  var stsLib = stsLib || {};
  (function (stsLib, global) {
    'use strict';
    var _ = stsLib;

    //----------------------------------------
    //◆メッセージ出力(alert/console.log)
    //----------------------------------------
    _.alert = function(message) {
      console.log(message);
    };

    //----------------------------------------
    //■stsLib.node名前空間
    //----------------------------------------
    _.node = stsLib.node || {};
    (function () {
      var _ = stsLib.node;

      //----------------------------------------
      //◇ファイル一覧
      //----------------------------------------

      //----------------------------------------
      //・トップフォルダのみのファイルアイテム列挙
      //----------------------------------------
      //  ・同期
      //  ・戻り値にはフォルダフルパスが入る
      //  ・戻り値以外は fs.readdir とほぼ同じ
      //----------------------------------------
      _.readTopDirSync = (folderPath) => {
        const result = fs.readdirSync(folderPath);
        return result.map((itemName) => {
          return path.join(folderPath, itemName);
        });
      };

      _.test_readTopDirSync = () => {
        const folderPath = process.cwd();

        const items = _.readTopDirSync(folderPath);
        items.forEach((itemPath) => {
          //console.log(itemPath);
        });

        c.check(true, a.isIncludeFunc(items,
          function(element, index, array) {
            return s.isEnd(element, 'stslib_test_nodejs.js');
          })
        );
      };

      //----------------------------------------
      //・サブフォルダ下位すべてのファイルアイテム列挙
      //----------------------------------------
      //  ・同期
      //  ・戻り値にはフォルダフルパスが入る
      //----------------------------------------
      _.readSubDirSync = (folderPath) => {
        let result = [];
        const readTopDirSync = ((folderPath) => {
          let items = fs.readdirSync(folderPath);
          items = items.map((itemName) => {
            return path.join(folderPath, itemName);
          });
          items.forEach((itemPath) => {
            result.push(itemPath);
            if (fs.statSync(itemPath).isDirectory()) {
              readTopDirSync(itemPath);
              //再帰処理
            }
          });
        });
        readTopDirSync(folderPath);
        return result;
      };

      _.test_readSubDirSync = () => {
        const folderPath = process.cwd();

        const items = _.readSubDirSync(folderPath);
        items.forEach((item) => {
          // console.log(item);
        });

        c.check(true, a.isIncludeFunc(items,
          (element, index, array) => {
            return s.isEnd(element, 'stslib_test_nodejs.js');
          })
        );
      };

      //----------------------------------------
      //・トップフォルダのみのファイルアイテム列挙
      //----------------------------------------
      //  ・非同期
      //  ・errorFunc:  エラー時の処理
      //  ・itemFunc:   ファイル/ディレクトリ列挙時の処理
      //  ・finishFunc: 処理終了時に一覧を取得する時の処理
      //----------------------------------------
      _.readTopDir = (folderPath, errorFunc, itemFunc, finishFunc) => {
        c.assert(t.isString(folderPath));
        //関数指定がないか、もしくは、関数かを判定
        c.assert(t.isNullOrUndefined(errorFunc) || t.isFunction(errorFunc));
        c.assert(t.isNullOrUndefined(itemFunc) || t.isFunction(itemFunc));
        c.assert(t.isNullOrUndefined(finishFunc) || t.isFunction(finishFunc));

        fs.readdir(folderPath, (err, items) => {
          if (err) {
            if (errorFunc) {
              errorFunc(err);
            }
          }

          items = items.map((itemName) => {
            return path.join(folderPath, itemName);
          });

          if (itemFunc) {
            items.forEach((itemPath) => {
              itemFunc(itemPath);
            });
          }

          if (finishFunc) {
            finishFunc(items);
          }

        });
      };

      _.test_readTopDir = () => {
        const folderPath = process.cwd();

        //第三引数省略
        _.readTopDir(folderPath,
          (err) => { throw err },
          (itemPath) => {
            // console.log(itemPath);
          }
        );

        //第二引数省略
        _.readTopDir(folderPath,
          (err) => { throw err },
          undefined,
          (items) => {
            items.forEach((itemPath) => {
              // console.log(itemPath);
            });

            c.check(true, a.isIncludeFunc(items,
              (element, index, array) => {
                return s.isEnd(element, 'stslib_test_nodejs.js');
              })
            );
          }
        );
      };

      //----------------------------------------
      //・サブフォルダ下位すべてのファイルアイテム列挙
      //----------------------------------------
      //  ・非同期
      //  ・errorFunc:  エラー時の処理
      //  ・itemFunc:   ファイル/ディレクトリ列挙時の処理
      //  ・finishFunc: 処理終了時に一覧を取得する時の処理
      //----------------------------------------
      _.readSubDir = (folderPath, errorFunc, itemFunc, finishFunc) => {
        c.assert(t.isString(folderPath));
        //関数指定がないか、もしくは、関数かを判定
        c.assert(t.isNullOrUndefined(errorFunc) || t.isFunction(errorFunc));
        c.assert(t.isNullOrUndefined(itemFunc) || t.isFunction(itemFunc));
        c.assert(t.isNullOrUndefined(finishFunc) || t.isFunction(finishFunc));

        let result = [];
        let execCounter = 0;
        const readTopDir = (folderPath) => {
          execCounter += 1;
          fs.readdir(folderPath, function(err, items) {
            if (err) {
              if (errorFunc) {
                errorFunc(err);
              }
            }

            items = items.map((itemName) => {
              return path.join(folderPath, itemName);
            });

            items.forEach((itemPath) => {
              result.push(itemPath);
              if (itemFunc) {
                itemFunc(itemPath);
              }
              if (fs.statSync(itemPath).isDirectory()) {
                //フォルダなら再帰呼び出し
                readTopDir(itemPath);
              }
            });
            execCounter -= 1;
            if (execCounter === 0) {
              if (finishFunc) {
                finishFunc(result);
              }
            }
          });
        }
        readTopDir(folderPath);
      };

      _.test_readSubDir = function() {
        const folderPath = process.cwd();

        //第三引数省略
        _.readSubDir(folderPath,
          (err) => { throw err },
          (itemPath) => {
            // console.log(itemPath);
          }
        );

        //第二引数省略
        _.readSubDir(folderPath,
          (err) => { throw err },
          undefined,
          (items) => {
            items.forEach((itemPath) => {
              // console.log(itemPath);
            });

            c.check(true, a.isIncludeFunc(items,
              (element, index, array) => {
                return s.isEnd(element, 'stslib_test_nodejs.js');
              })
            );
          }
        );
      };

    }());   //stsLib.node

    //----------------------------------------
    //◆省略呼び出し
    //----------------------------------------
    var x = stsLib.syntax;
    var t = stsLib.type;
    var c = stsLib.compare;
    var a = stsLib.array;
    var n = stsLib.number;
    var s = stsLib.string;
    var d = stsLib.date;
    var p = stsLib.point;
    var v = stsLib.vector;
    var r = stsLib.rect;

  }(stsLib, this));   //stsLib

  //----------------------------------------
  //◆モジュール登録
  //----------------------------------------
  var moduleExports = function(object, registFileName) {
    if (typeof module === 'undefined') {
      //拡張子が省略されている場合は追加
      if (registFileName.indexOf('.') === -1) {
        registFileName += '.js';
      }
      requireList[registFileName] = stsLib;
    } else {
      module.exports = object;
    }
  };

  moduleExports(stsLib, 'stslib_node.js');

}()); //(function() {

