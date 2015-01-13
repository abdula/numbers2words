/**
 * Number.isInteger() polyfill
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
 */
if (!Number.isInteger) {
  Number.isInteger = function isInteger (nVal) {
    return typeof nVal === "number" && isFinite(nVal) && nVal > -9007199254740992 && nVal < 9007199254740992 && Math.floor(nVal) === nVal;
  };
}
/**
/**
 * It converts a numeric value to words.
 * @class
 * @public
 * @constructor
 * @param {String} localeName 
 */
var T2W = function( localeName ) {	
	var type = localeName, translator;
	
	// error if the constructor doesn't exist
	if( typeof T2W[ type ] !== "function" ) {
		throw {
			name : "Error",
			message : "Locale with name '" + type + "' doesn't exist."		
		};
	}
		
	translator = new T2W[ type ]();
	translator._tokenLength = T2W[ type ].TOKEN_LENGTH | T2W.DEFAULT_TOKEN_LENGTH;
	
	// Extends
	// Copy prototype methods from T2W to translator object 
	for (var key in T2W.prototype) {
		if( T2W.prototype.hasOwnProperty( key ) ) {
			if( translator[key] !== 'function' ){
				T2W[ type ].prototype[key] = T2W.prototype[key];
			}			
		}				
	}
	
	return translator;	
};

/**
 * Numeral system
 * @constant
 * @type {number}
 */
T2W.RADIX = 10;

/**
 * Default token length
 * @constant
 * @type {number}
 */
T2W.DEFAULT_TOKEN_LENGTH = 1;


/**
 * Single index
 * @constant
 * @type {number}
 */
T2W.SINGLE_INDEX = 0;

/**
 * Ten index
 * @constant
 * @type {number}
 */
T2W.TEN_INDEX = 1;

/**
 * Hundred index
 * @constant
 * @type {number}
 */
T2W.HUNDRED_INDEX = 2;

/**
 * Translate number to words
 * @public
 * @param {integer} value
 * @return{string}
 * @example 
 * this.toWords( 1234 )
 * // one thousand two hundred thirty four
 */
T2W.prototype.toWords = function( number ){
	
	if(typeof this.translate != 'function'){
		throw {
			name:"Error",
			message: "The function 'translate' is not implemented."			
		};
	}
				
	return this.translate( this.tokenize(number, this._tokenLength));
};

/**
 * Split number to tokens
 * @param {number} number
 * @param {number} tokenLength - count of numbers in one token
 * @return {Array}
 * @example 
 * this.tokenize( 1234, 1 ); // [4,3,2,1]
 * this.tokenize( 1234, 2 ); // [34,12]
 * this.tokenize( 1234, 3 ); // [234,1]
 */
T2W.prototype.tokenize = function( number, tokenLength ){
	
	if(!Number.isInteger(number)){
		throw {
			name:"NumberFormatExceprion",
			message: "'" + number + "' is not Integer."	
		};
	}
	
	if(number === 0){
		return [0];
	}
	
	var tokens = [];
	var base = Math.pow( T2W.RADIX, tokenLength );
	while( number ){    
    	tokens.push( number % base );
    	number = parseInt( number / base, T2W.RADIX );    
	}
	return tokens;
};


/**
 * cs_CZ locale
 * @constructor
 */
T2W.CS_CZ = function(){};

/**
 * Translator dictionary
 * @constant
 * @type {Object}
 */
T2W.CS_CZ.DICTIONARY = {	
	ones		:[
					[ "", "jedna", "dva", "tři", "čtyři", "pět", "šest", "sedm", "osm", "devět" ],
					[ "", "jedentisíc", "dvatisíce", "třitisíce", "čtyřitisíce", "pěttisíc", "šesttisíc", "sedmtisíc", "osmtisíc", "devěttisíc" ],
					[ "", "jedenmilión", "dvamilióny", "třimilióny", "čtyřimilióny", "pětmiliónů", "šestmiliónů", "sedmmiliónů", "osmmiliónů", "devěmiliónů"]					
				],
	teens		:[ "deset", "jedenáct", "dvanáct", "třináct", "čtrnáct", "patnáct", "šestnáct", "sedmnáct", "osmnáct", "devatenáct" ],
	tens		:[ "", "", "dvacet", "třicet", "čtyřicet", "padesát", "šedesát", "sedmdesát", "osmdesát", "devadesát" ],
	hundreds	:[ "", "sto", "dvěstě", "třista", "čtyřista", "pětset", "šestset", "sedmset", "osmset", "devětset" ],

	radix:["", "tisíc", "miliónů"],
	exceptions	:["nula", "", "dvě"]	
};

/**
 * Token length
 * @constant
 * @type {number}
 */
T2W.CS_CZ.TOKEN_LENGTH = 3;

/**
 * Max numbers for this locale
 * @constant
 * @type {number}
 */
T2W.CS_CZ.MAX_NUMBERS = 9;

/**
 * Translate numbers to words
 * @public
 * @param {array} numbers
 * @param {number} index
 * @return {string}
 */
T2W.CS_CZ.prototype.translate = function( numbers ) {	
	
	// Check max value	
	if(numbers.length * T2W.CS_CZ.TOKEN_LENGTH > T2W.CS_CZ.MAX_NUMBERS){
		throw {
			name : "Error",
			message : "The length of numbers is longer than the maximum value(" + T2W.CS_CZ.MAX_NUMBERS + ")."		
		};	
	}		
	
	// Deal with exceptions - zero	
	if( numbers[T2W.SINGLE_INDEX] === 0 && numbers.length === 1){
		return T2W.CS_CZ.DICTIONARY.exceptions[numbers[T2W.SINGLE_INDEX]];
	}
		
	var words = [];
	for(var idx = 0, max = numbers.length; idx < max; idx++){				
		words.unshift( this._getTrio( this.tokenize( numbers[idx], 1 ), idx) );	
	}
	
	return words.join("");								
};

/**
 * Converts first three numbers to words.
 * @private
 * It solves exceptions in the Czech language.
 * @param {Array} numbers
 * @param {number} index
 * @return {string}
 */
T2W.CS_CZ.prototype._getTrio = function(numbers, index){																				
	var hundred = '';
	var ten = '';
	var single = '';
	var radix = this._getRadix( index );
	
	if(numbers[T2W.HUNDRED_INDEX]){
		hundred = this._getHundreds(numbers[T2W.HUNDRED_INDEX]);
	}
	
	if( numbers[ T2W.TEN_INDEX ] ){			
		ten = this._getTeens( numbers[T2W.SINGLE_INDEX]);			
	}
						
	if( numbers[ T2W.TEN_INDEX ] >=2 ){		
		ten = this._getTens( numbers[T2W.TEN_INDEX]) + this._getOnes( numbers[T2W.SINGLE_INDEX], T2W.SINGLE_INDEX);	
	}
							
	if( !numbers[ T2W.TEN_INDEX ] ){
		single = this._getOnes( numbers[T2W.SINGLE_INDEX], T2W.SINGLE_INDEX );
	}
	
	// Deal with exceptions	- dvě | dva
	if(!numbers[T2W.HUNDRED_INDEX] && !numbers[ T2W.TEN_INDEX ] && numbers[T2W.SINGLE_INDEX] === 2){
		single = T2W.CS_CZ.DICTIONARY.exceptions[numbers[T2W.SINGLE_INDEX]];
	}
	
	if(index > 0 && numbers.length === 1){
		single = this._getOnes( numbers[T2W.SINGLE_INDEX], index);
		radix = '';	
	}
								
	return hundred + ten + single + radix;		
};

/**
 * Get ones
 * helper method to access the dictionary
 * @private
 * @param {number} number
 * @param {number} index у
 * @return {string}
 */
T2W.CS_CZ.prototype._getOnes = function( number, index ) {			
	return T2W.CS_CZ.DICTIONARY.ones[index][ number ];			
};

/**
 * Get tens
 * helper method to access the dictionary
 * @private
 * @param {number} number
 * @return {string}
 */
T2W.CS_CZ.prototype._getTens = function( number ) {		
	return T2W.CS_CZ.DICTIONARY.tens[ number ];				
};

/**
 * Get teens
 * helper method to access the dictionary
 * @private
 * @param {number} number
 * @return {string}
 */
T2W.CS_CZ.prototype._getTeens = function(number ){
	return T2W.CS_CZ.DICTIONARY.teens[ number ];
};

/**
 * Get hundreds
 * helper method to access the dictionary
 * @private
 * @param {number} number
 * @return {string}
 */
T2W.CS_CZ.prototype._getHundreds = function( number ) {		
	return T2W.CS_CZ.DICTIONARY.hundreds[ number ];
};

/**
 * Get radix
 * convert radix to words
 * @private
 * @param {number} index
 * @return {string}
 */
T2W.CS_CZ.prototype._getRadix = function( index ) {		
	return T2W.CS_CZ.DICTIONARY.radix[ index ];
};

/**
 * en_US locale
 * @constructor
 */
T2W.EN_US = function(){};

/**
 * Translator dictionary
 * @constant
 * @type {Object}
 */
T2W.EN_US.DICTIONARY = {
	zero		:"zero",
	ones		:[ "", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine" ],
	teens		:[ "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eightteen", "nineteen" ],
	tens		:[ "", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety" ],
	hundred		:"hundred",
	radix		:["", "thousand", "million"],
	delimiters	:["-", "and"]
};

/**
 * Token length
 * @constant
 * @type {number}
 */
T2W.EN_US.TOKEN_LENGTH = 3;

/**
 * Max numbers for this locale
 * @constant
 * @type {number}
 */
T2W.EN_US.MAX_NUMBERS = 9;

/**
 * Translate numbers to words
 * @public
 * @param {array} numbers
 * @param {number} index
 * @return {string}
 */
T2W.EN_US.prototype.translate = function( numbers ) {	
	
	// Check max value	
	if(numbers.length * T2W.EN_US.TOKEN_LENGTH > T2W.EN_US.MAX_NUMBERS){
		throw {
			name : "Error",
			message : "The length of numbers is longer than the maximum value(" + T2W.EN_US.MAX_NUMBERS + ")."		
		};	
	}		
	
	// Deal with zero value	
	if(numbers[T2W.SINGLE_INDEX] === 0 && numbers.length === 1){
		return T2W.EN_US.DICTIONARY.zero;
	}
	
	var words = [];
	for(var idx = 0, max = numbers.length; idx < max; idx++){				
		words.unshift( this._getTrio( this.tokenize( numbers[idx], 1 ), idx, max));	
	}
	
	return words.join("");								
};

/**
 * Converts first three numbers to words.
 * @private
 * It solves exceptions in the English language.
 * @param {Array} numbers
 * @param {number} index
 * @param {number} max - length of tokens
 * @return {string}
 */
T2W.EN_US.prototype._getTrio = function( numbers, index, max){																				
	var hundred = '';
	var ten = '';
	var single = '';
	var radix = this._getRadix(numbers, index);
	
	if(numbers[T2W.HUNDRED_INDEX]){
		hundred = numbers[T2W.TEN_INDEX] || numbers[T2W.SINGLE_INDEX] 
			? this._getOnes( numbers[ T2W.HUNDRED_INDEX ] ) + " " + T2W.EN_US.DICTIONARY.hundred + ' ' + T2W.EN_US.DICTIONARY.delimiters[1] + ' '
			: this._getOnes( numbers[ T2W.HUNDRED_INDEX ] ) + " " + T2W.EN_US.DICTIONARY.hundred;
	}
	
	if( numbers[ T2W.TEN_INDEX ] ){			
		ten = this._getTeens( numbers[T2W.SINGLE_INDEX]);			
	}
						
	if( numbers[ T2W.TEN_INDEX ] >=2 ){
		ten = numbers[T2W.SINGLE_INDEX] 
			? this._getTens( numbers[T2W.TEN_INDEX]) + T2W.EN_US.DICTIONARY.delimiters[0] + this._getOnes( numbers[T2W.SINGLE_INDEX]) 
			: this._getTens( numbers[T2W.TEN_INDEX]); 	
	}
							
	if( !numbers[ T2W.TEN_INDEX ] ){
		single = this._getOnes( numbers[T2W.SINGLE_INDEX]);
	}
				
	if(index+1 < max && (numbers[T2W.HUNDRED_INDEX] || numbers[T2W.TEN_INDEX] || numbers[T2W.SINGLE_INDEX]) ){
		hundred = ' ' + hundred;
	}
	
	if( index === 0 && index+1 < max && !numbers[ T2W.HUNDRED_INDEX ] && (numbers[T2W.TEN_INDEX] || numbers[T2W.SINGLE_INDEX] )){
		hundred	 = ' ' + T2W.EN_US.DICTIONARY.delimiters[1] + ' ';		
	}
								
	return hundred + ten + single + radix;		
};

/**
 * Get ones
 * helper method to access the dictionary
 * @private
 * @param {number} number
 * @param {number} index
 * @return {string}
 */
T2W.EN_US.prototype._getOnes = function( number) {			
	return T2W.EN_US.DICTIONARY.ones[ number ];			
};

/**
 * Get tens
 * helper method to access the dictionary
 * @private
 * @param {number} number
 * @return {string}
 */
T2W.EN_US.prototype._getTens = function( number ) {		
	return T2W.EN_US.DICTIONARY.tens[ number ];				
};

/**
 * Get teens
 * helper method to access the dictionary
 * @private
 * @param {number} number
 * @return {string}
 */
T2W.EN_US.prototype._getTeens = function(number ){
	return T2W.EN_US.DICTIONARY.teens[ number ];
};

/**
 * Get radix
 * convert radix to words
 * @private
 * @param {Array} numbers
 * @param {number} index
 * @return {string}
 */
T2W.EN_US.prototype._getRadix = function( numbers, index ) {		
	var radix = '';
	if( index > 0 && (numbers[T2W.HUNDRED_INDEX] || numbers[T2W.TEN_INDEX] || numbers[T2W.SINGLE_INDEX])){	
		radix = ' ' + T2W.EN_US.DICTIONARY.radix[ index ];			
	}
			
	return radix;
};

/**
 * RU_RU locale
 * @constructor
 */
T2W.RU_RU = function(){};

/**
 * Translator dictionary
 * @constant
 * @type {Object}
 */
T2W.RU_RU.DICTIONARY = {
  zero		:"ноль",
  ones		:[ "", "один", "два", "три", "четыре", "пять", "шесть", "семь", "восемь", "девять" ],
  teens		:[ "десять", "одиннадцать", "двенадцать", "тринадцать", "четырнадцать", "пятнадцать", "шестадцать", "семьнадцать", "восемнадцать", "девятнадцать" ],
  tens		:[ "", "", "двадцать", "тридцать", "сорок", "пятьдесят", "шестьдесят", "семьдесят", "восемьдесят", "девяносто" ],
  hundreds	:[ "", "сто", "двести", "триста", "четыреста", "пятьсот", "шестьсот", "семьсот", "восемьсот", "девятьсот" ],
  radix		:["", "тысяча", "миллион"],
  delimiters	:[" ", ""],
  exceptions	:["ноль", "", "две"],
  unit: [
    ['тысяча'  ,'тысячи'  ,'тысяч'     ,1],
    ['миллион' ,'миллиона','миллионов' ,0]
  ]
};

T2W.RU_RU.prototype.toWords = function( number ){
  return this.translate(number);
};


/**
 * Token length
 * @constant
 * @type {number}
 */
T2W.RU_RU.TOKEN_LENGTH = 9;

/**
 * Max numbers for this locale
 * @constant
 * @type {number}
 */
T2W.RU_RU.MAX_NUMBERS = 9;

/**
 * Translate numbers to words
 * @public
 * @param {array} numbers
 * @param {number} index
 * @return {string}
 */
T2W.RU_RU.prototype.translate = function( numbers ) {

  // Check max value	
  if(numbers.length * T2W.RU_RU.TOKEN_LENGTH > T2W.RU_RU.MAX_NUMBERS){
    throw {
      name : "Error",
      message : "The length of numbers is longer than the maximum value(" + T2W.RU_RU.MAX_NUMBERS + ")."
    };
  }

  return number_to_string(numbers);

//  // Deal with zero value
//  if( numbers[T2W.SINGLE_INDEX] === 0 && numbers.length === 1){
//    return T2W.RU_RU.DICTIONARY.exceptions[numbers[T2W.SINGLE_INDEX]];
//  }
//
//  var words = [];
//  for(var idx = 0, max = numbers.length; idx < max; idx++){
//    words.unshift( this._getTrio( this.tokenize( numbers[idx], 1 ), idx) );
//  }
//
//  return words.join("");
};

/**
 * Converts first three numbers to words.
 * @private
 * It solves exceptions in the English language.
 * @param {Array} numbers
 * @param {number} index
 * @param {number} max - length of tokens
 * @return {string}
 */
T2W.RU_RU.prototype._getTrio = function(numbers, index){
  var hundred = '';
  var ten = '';
  var single = '';
  var radix = this._getRadix( index );

  if(numbers[T2W.HUNDRED_INDEX]){
    hundred = this._getHundreds(numbers[T2W.HUNDRED_INDEX]);
  }

  if( numbers[ T2W.TEN_INDEX ] ){
    ten = this._getTeens( numbers[T2W.SINGLE_INDEX]);
  }

  if( numbers[ T2W.TEN_INDEX ] >=2 ){
    ten = this._getTens( numbers[T2W.TEN_INDEX]) + T2W.RU_RU.DICTIONARY.delimiters[0] + this._getOnes( numbers[T2W.SINGLE_INDEX], T2W.SINGLE_INDEX);
  }

  if( !numbers[ T2W.TEN_INDEX ] ){
    single = this._getOnes( numbers[T2W.SINGLE_INDEX], T2W.SINGLE_INDEX );
  }

  // Deal with exceptions	- dvě | dva
  if(!numbers[T2W.HUNDRED_INDEX] && !numbers[ T2W.TEN_INDEX ] && numbers[T2W.SINGLE_INDEX] === 2){
    single = T2W.RU_RU.DICTIONARY.exceptions[numbers[T2W.SINGLE_INDEX]];
  }

  if(index > 0 && numbers.length === 1){
    single = this._getOnes( numbers[T2W.SINGLE_INDEX], index);
    radix = '';
  }

  return [hundred + ten + single + radix].join(' ');
};

T2W.RU_RU.prototype._getHundreds = function( number ) {
  return T2W.RU_RU.DICTIONARY.hundreds[ number ];
};


/**
 * Get ones
 * helper method to access the dictionary
 * @private
 * @param {number} number
 * @param {number} index
 * @return {string}
 */
T2W.RU_RU.prototype._getOnes = function( number) {
  return T2W.RU_RU.DICTIONARY.ones[ number ];
};

/**
 * Get tens
 * helper method to access the dictionary
 * @private
 * @param {number} number
 * @return {string}
 */
T2W.RU_RU.prototype._getTens = function( number ) {
  return T2W.RU_RU.DICTIONARY.tens[ number ];
};

/**
 * Get teens
 * helper method to access the dictionary
 * @private
 * @param {number} number
 * @return {string}
 */
T2W.RU_RU.prototype._getTeens = function(number ){
  return T2W.RU_RU.DICTIONARY.teens[ number ];
};

/**
 * Get radix
 * convert radix to words
 * @private
 * @param {Array} numbers
 * @param {number} index
 * @return {string}
 */
T2W.RU_RU.prototype._getRadix = function( index ) {
  return T2W.RU_RU.DICTIONARY.radix[ index ];
};


















//var morph, str_split;

function number_to_string(num) {
  var a20, gender, hundred, i1, i2, i3, kop, leading_zeros, nul, out, rub, ten, tens, uk, unit, v, zeros, _i, _len, _ref, _ref1, _ref2;
  nul = 'ноль';
  ten = [['', 'один', 'два', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять'], ['', 'одна', 'две', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять']];
  a20 = ['десять', 'одиннадцать', 'двенадцать', 'тринадцать', 'четырнадцать', 'пятнадцать', 'шестнадцать', 'семнадцать', 'восемнадцать', 'девятнадцать'];
  tens = ['', '', 'двадцать', 'тридцать', 'сорок', 'пятьдесят', 'шестьдесят', 'семьдесят', 'восемьдесят', 'девяносто'];
  hundred = ['', 'сто', 'двести', 'триста', 'четыреста', 'пятьсот', 'шестьсот', 'семьсот', 'восемьсот', 'девятьсот'];
  unit = [['копейка', 'копейки', 'копеек', 1], ['рубль', 'рубля', 'рублей', 0], ['тысяча', 'тысячи', 'тысяч', 1], ['миллион', 'миллиона', 'миллионов', 0], ['миллиард', 'милиарда', 'миллиардов', 0]];
  _ref = parseFloat(num).toFixed(2).split('.'), rub = _ref[0], kop = _ref[1];
  if ((leading_zeros = 12 - rub.length) < 0) {
    return false;
  }
  zeros = ((function() {
    var _results;
    _results = [];
    while (leading_zeros--) {
      _results.push('0');
    }
    return _results;
  })());
  rub = zeros.join('') + rub;
  out = [];
  if (rub > 0) {
    _ref1 = str_split(rub, 3);
    for (uk = _i = 0, _len = _ref1.length; _i < _len; uk = ++_i) {
      v = _ref1[uk];
      if (!(v > 0)) {
        continue;
      }
      uk = unit.length - uk - 1;
      gender = unit[uk][3];
      _ref2 = str_split(v, 1), i1 = _ref2[0], i2 = _ref2[1], i3 = _ref2[2];
      out.push(hundred[i1]);
      if (i2 > 1) {
        out.push(tens[i2] + ' ' + ten[gender][i3]);
      } else {
        out.push(i2 > 0 ? a20[i3] : ten[gender][i3]);
      }
      if (uk > 1) {
        out.push(morph(v, unit[uk][0], unit[uk][1], unit[uk][2]));
      }
    }
  } else {
    out.push(nul);
  }
  //out.push(morph(rub, unit[1][0], unit[1][1], unit[1][2]));
  //out.push(kop);
  return out.join(' ').replace(RegExp(' {2,}', 'g'), ' ').trimLeft();
}

function morph(n, f1, f2, f5) {
  n = n % 100;
  if (n > 10 && n < 20) {
    return f5;
  }
  n = n % 10;
  if (n > 1 && n < 5) {
    return f2;
  }
  if (n === 1) {
    return f1;
  }
  return f5;
}



function str_split(string, split_length) {
  var chunks, len, pos;
  if (string == null) {
    string = "";
  }
  if (split_length == null) {
    split_length = 1;
  }
  chunks = [];
  pos = 0;
  len = string.length;
  while (pos < len) {
    chunks.push(string.slice(pos, pos += split_length));
  }
  return chunks;
}

/**
 * ua_UA locale
 * @constructor
 */
T2W.UA_UA = function(){};

/**
 * Translator dictionary
 * @constant
 * @type {Object}
 */
T2W.UA_UA.DICTIONARY = {
  ones		:[
    [ "", "один", "два", "три", "чотири", "п’ять", "шість", "сім", "вісім", "дев'ять" ],
    [ "", "одна тисяча", "дві тисячі", "три тисячі", "чотири тисячі", "п'ять тисяч", "шість тисяч", "сім тисяч", "вісім тисяч", "дев'ять тисяч" ],
    [ "", "один мільйон", "два мільйони", "три мільйони", "чотири мільйони", "п'ять мільйонів", "шість мільйонів", "сім мільйонів", "вісім мільйонів", "дев'ять мільйонів"]
  ],
  teens		:[ "десять", "одинадцять", "дванадцять", "тринадцять", "чотирнадцять", "п'ятнадцять", "шістнадцять", "сімнадцять", "вісімнадцять", "дев'ятнадцять" ],
  tens		:[ "", "", "двадцять", "тридцять", "сорок", "п'ятдесят", "шістдесят", "сімдесят", "вісімдесят", "дев'яносто" ],
  hundreds	:[ "", "сто", "двісті", "триста", "чотириста", "п'ятсот", "шістсот", "сімсот", "вісімсот", "дев'ятсот" ],

  radix:["", " тисяч", " мільйонів"],
  exceptions	:["нуль"]
};

/**
 * Token length
 * @constant
 * @type {number}
 */
T2W.UA_UA.TOKEN_LENGTH = 3;

/**
 * Translate numbers to words
 * @public
 * @param {array} numbers
 * @param {number} index
 * @return {string}
 */
T2W.UA_UA.prototype.translate = function( numbers ) {

  // Check max value
  if(numbers.length * T2W.UA_UA.TOKEN_LENGTH > T2W.UA_UA.MAX_NUMBERS){
    throw {
      name : "Error",
      message : "The length of numbers is longer than the maximum value(" + T2W.UA_UA.MAX_NUMBERS + ")."
    };
  }

  // Deal with exceptions - zero
  if( numbers[T2W.SINGLE_INDEX] === 0 && numbers.length === 1){
    return T2W.UA_UA.DICTIONARY.exceptions[numbers[T2W.SINGLE_INDEX]];
  }

  var words = [];
  for(var idx = 0, max = numbers.length; idx < max; idx++){
    words.unshift( this._getTrio( this.tokenize( numbers[idx], 1 ), idx) );
  }

  var w = [];
  words.forEach(function (el) {
    if (el) {
      w.push(el);
    }
  });

  return w.join(" ");
};

/**
 * Converts first three numbers to words.
 * @private
 * It solves exceptions in the Czech language.
 * @param {Array} numbers
 * @param {number} index
 * @return {string}
 */
T2W.UA_UA.prototype._getTrio = function(numbers, index){

  var hundred = '';
  var ten = '';
  var single = '';
  var radix = this._getRadix( index );

  if(numbers[T2W.HUNDRED_INDEX]){
    hundred = this._getHundreds(numbers[T2W.HUNDRED_INDEX]) + (numbers[T2W.TEN_INDEX] || numbers[T2W.SINGLE_INDEX] ? ' ' : '');
  }

  if( numbers[ T2W.TEN_INDEX ] ){
    ten = this._getTeens( numbers[T2W.SINGLE_INDEX]);
  }

  if( numbers[ T2W.TEN_INDEX ] >=2 ){
    ten = this._getTens( numbers[T2W.TEN_INDEX]) + (numbers[T2W.SINGLE_INDEX] ? ' ' : '') + this._getOnes( numbers[T2W.SINGLE_INDEX], T2W.SINGLE_INDEX);
  }

  if( !numbers[ T2W.TEN_INDEX ] ){
    single = this._getOnes( numbers[T2W.SINGLE_INDEX], T2W.SINGLE_INDEX );
  }

  // Deal with exceptions	- dvě | dva
//  if(!numbers[T2W.HUNDRED_INDEX] && !numbers[ T2W.TEN_INDEX ] && numbers[T2W.SINGLE_INDEX] === 2){
//    single = T2W.UA_UA.DICTIONARY.exceptions[numbers[T2W.SINGLE_INDEX]];
//  }


  if(index > 0 && numbers.length === 1){
    single = this._getOnes( numbers[T2W.SINGLE_INDEX], index);
    radix = '';
  }

//  if (hundred) {
//    console.log('!!!!!', index, numbers.length, radix, numbers);
//    console.log('hundred', hundred);
//    console.log('ten', ten);
//    console.log('single', single);
//    console.log('radix', radix);
//    console.log('!!!!!');
//  }





  return hundred + ten + single + radix;
};

/**
 * Get ones
 * helper method to access the dictionary
 * @private
 * @param {number} number
 * @param {number} index
 * @return {string}
 */
T2W.UA_UA.prototype._getOnes = function( number, index ) {
  return T2W.UA_UA.DICTIONARY.ones[index][ number ];
};

/**
 * Get tens
 * helper method to access the dictionary
 * @private
 * @param {number} number
 * @return {string}
 */
T2W.UA_UA.prototype._getTens = function( number ) {
  return T2W.UA_UA.DICTIONARY.tens[ number ];
};

/**
 * Get teens
 * helper method to access the dictionary
 * @private
 * @param {number} number
 * @return {string}
 */
T2W.UA_UA.prototype._getTeens = function(number ){
  return T2W.UA_UA.DICTIONARY.teens[ number ];
};

/**
 * Get hundreds
 * helper method to access the dictionary
 * @private
 * @param {number} number
 * @return {string}
 */
T2W.UA_UA.prototype._getHundreds = function( number ) {
  return T2W.UA_UA.DICTIONARY.hundreds[ number ];
};

/**
 * Get radix
 * convert radix to words
 * @private
 * @param {number} index
 * @return {string}
 */
T2W.UA_UA.prototype._getRadix = function( index ) {
  return T2W.UA_UA.DICTIONARY.radix[ index ];
};

// Node exports
if(module.exports){
	module.exports = T2W;
}