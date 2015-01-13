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
