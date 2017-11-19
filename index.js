'use strict';

/**
 * @mixin
 */
var finHypergridPrimaryKey = {
    /**
     * @summary Remove the ID'd data row object from the data store.
     * @desc If data source pipeline in use, to see the deletion in the grid, you must eventually call:
     * ```javascript
     * this.grid.behavior.reindex();
     * this.grid.behaviorChanged();
     * ```
     * Caveat: The row indexes of all rows following the deleted row will now be one less than they were!
     * @param {object|string} keyOrHash - One of:
     * * _string_ - Column name.
     * * _object_ - Hash of 0 or more key-value pairs to search for.
     * @param {*|string[]} [valOrList] - One of:
     * _omitted_ - When `keyOrHash` is a hash and you want to search all its keys.
     * _string[]_ - When `keyOrHash` is a hash but you only want to search certain keys.
     * _otherwise_ - When `keyOrHash` is a string. Value to search for.
     * @returns {object} The deleted row object.
     */
    deleteRowById: function(keyOrHash, valOrList) {
        return this.source.findRow.apply(this.source, getByIdArgs(keyOrHash, valOrList).concat([null]));
    },

    /**
     * @summary Undefine the ID'd row object in place.
     * @desc Similar to {@link rowById.deleteRowById|deleteRowById} except leave an `undefined` in place of data row object. This renders as a blank row in the grid.
     *
     * If data source pipeline in use, to see the deletion in the grid, you must eventually call:
     * ```javascript
     * this.grid.behavior.reindex();
     * this.grid.behaviorChanged();
     * ```
     * @param {object|string} keyOrHash - One of:
     * * _string_ - Column name.
     * * _object_ - Hash of 0 or more key-value pairs to search for.
     * @param {*|string[]} [valOrList] - One of:
     * _omitted_ - When `keyOrHash` is a hash and you want to search all its keys.
     * _string[]_ - When `keyOrHash` is a hash but you only want to search certain keys.
     * _otherwise_ - When `keyOrHash` is a string. Value to search for.
     * @returns {object} The deleted row object.
     */
    eraseRowById: function(keyOrHash, valOrList) {
        return this.source.findRow.apply(this.source, getByIdArgs(keyOrHash, valOrList).concat([undefined]));
    },

    /**
     * @param {object|string} keyOrHash - One of:
     * * _string_ - Column name.
     * * _object_ - Hash of 0 or more key-value pairs to search for.
     * @param {*|string[]} [valOrList] - One of:
     * _omitted_ - When `keyOrHash` is a hash and you want to search all its keys.
     * _string[]_ - When `keyOrHash` is a hash but you only want to search certain keys.
     * _otherwise_ - When `keyOrHash` is a string. Value to search for.
     * @returns {number}
     */
    getRowIndexById: function(keyOrHash, valOrList) {
        this.source.findRow.apply(this.source, arguments);
        return this.source.getProperty('foundRowIndex');
    },

    /**
     * @param {object|string} keyOrHash - One of:
     * * _string_ - Column name.
     * * _object_ - Hash of 0 or more key-value pairs to search for.
     * @param {*|string[]} [valOrList] - One of:
     * _omitted_ - When `keyOrHash` is a hash and you want to search all its keys.
     * _string[]_ - When `keyOrHash` is a hash but you only want to search certain keys.
     * _otherwise_ - When `keyOrHash` is a string. Value to search for.
     * @returns {object}
     */
    getRowById: function(keyOrHash, valOrList) {
        return this.source.findRow.apply(this.source, arguments);
    },

    /**
     * @summary Update selected columns in existing data row.
     * @desc If data source pipeline in use, to see the deletion in the grid, you must eventually call:
     * ```javascript
     * this.grid.behavior.reindex();
     * this.grid.repaint();
     * ```
     * @param {object|string} findKeyOrHash - One of:
     * * _string_ - Column name.
     * * _object_ - Hash of zero or more key-value pairs to search for.
     * @param {*|string[]} [findValOrList] - One of:
     * _omitted_ - When `findKeyOrHash` is a hash and you want to search all its keys.
     * _string[]_ - When `findKeyOrHash` is a hash but you only want to search certain keys.
     * _otherwise_ - When `findKeyOrHash` is a string. Value to search for.
     * @param {object|string} modKeyOrHash - One of:
     * * _string_ - Column name.
     * * _object_ - Hash of zero or more key-value pairs to modify.
     * @param {*|string[]} [modValOrList] - One of:
     * _omitted_ - When `modKeyOrHash` is a hash and you want to modify all its keys.
     * _string[]_ - When `modKeyOrHash` is a hash but you only want to modify certain keys.
     * _otherwise_ - When `modKeyOrHash` is a string. The modified value.
     * @returns {object} The modified row object.
     */
    modifyRowById: function(findKeyOrHash, findValOrList, modKeyOrHash, modValOrList) {
        var dataRow, keys, columnName;

        if (typeof findKeyOrHash !== 'object' || findValOrList instanceof Array) {
            dataRow = this.source.findRow(findKeyOrHash, findValOrList);
        } else {
            dataRow = this.source.findRow(findKeyOrHash);
            modValOrList = modKeyOrHash; // promote
            modKeyOrHash = findValOrList; // promote
        }

        if (dataRow) {
            if (typeof modKeyOrHash !== 'object') {
                dataRow[modKeyOrHash] = modValOrList;
            } else {
                keys = modValOrList instanceof Array ? modValOrList : Object.keys(modKeyOrHash);
                for (var key in keys) {
                    columnName = keys[key];
                    dataRow[columnName] = modKeyOrHash[columnName];
                }
            }
        }

        return dataRow;
    },

    /**
     * @summary Replace entire ID'd row object with another.
     * @desc The replacement may have (but does not have to have) the same ID as the row object being replaced.
     *
     * If data source pipeline in use, to see the replaced row in the grid, you must eventually call:
     * ```javascript
     * this.grid.behavior.reindex();
     * this.grid.behaviorChanged();
     * ```
     * @param {object|string} keyOrHash - One of:
     * * _string_ - Column name.
     * * _object_ - Hash of zero or more key-value pairs to search for.
     * @param {*|string[]} [valOrList] - One of:
     * _omitted_ - When `keyOrHash` is a hash and you want to search all its keys.
     * _string[]_ - When `keyOrHash` is a hash but you only want to search certain keys.
     * _otherwise_ - When `keyOrHash` is a string. Value to search for.
     * @param {object} replacement
     * @returns {object} The replaced row object.
     */
    replaceRowById: function(keyOrHash, valOrList, replacement) {
        if (typeof keyOrHash === 'object' && !(valOrList instanceof Array)) {
            replacement = valOrList; // promote
        }
        if (typeof replacement !== 'object') {
            throw 'Expected an object for replacement but found ' + typeof replacement + '.';
        }
        return this.source.findRow.apply(this.source, arguments);
    }
};

function getByIdArgs(keyOrHash, valOrList) {
    var length = typeof keyOrHash !== 'object' || valOrList instanceof Array ? 2 : 1;
    return Array.prototype.slice.call(arguments, 0, length);
}

// `install` defined here as be non-enumerable to avoid being mixed in
Object.defineProperties(finHypergridPrimaryKey, {
    /**
     * @name install
     * @summary Installer for plugin.
     * @desc Required by {@link Hypergrid#installPlugins}
     * @function
     * @param {Hypergrid} grid -
     * @param {object} target - Your data model instance or its prototype.
     * @memberOf rowById
     */
    install: {
        value: function(grid, target) {
            target = target || Object.getPrototypeOf(grid.behavior.dataModel);
            target.mixIn(this);
        }
    }
});

module.exports = finHypergridPrimaryKey;
