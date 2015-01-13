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

T2W.UA_UA.TOKEN_LENGTH = 9;

/**
 * Max numbers for this locale
 * @constant
 * @type {number}
 */
T2W.UA_UA.MAX_NUMBERS = 9;

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

  return number_to_string(numbers);

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


function number_to_string(num) {
  var a20, gender, hundred, i1, i2, i3, kop, leading_zeros, nul, out, rub, ten, tens, uk, unit, v, zeros, _i, _len, _ref, _ref1, _ref2;
  nul = 'нуль';
  ten = [["", "один", "два", "три", "чотири", "п'ять", "шість", "сім", "вісім", "дев'ять"], ['', 'одна', 'дві', 'три', "чотири", "п'ять", "шість", "сім", "вісім", "дев'ять"]];
  a20 = ["десять", "одинадцять", "дванадцять", "тринадцять", "чотирнадцять", "п'ятнадцять", "шістнадцять", "сімнадцять", "вісімнадцять", "дев'ятнадцять"];
  tens = ['', '', "двадцять", "тридцять", "сорок", "п'ятдесят", "шістдесят", "сімдесят", "вісімдесят", "дев'яносто"];
  hundred = ['', "сто", "двісті", "триста", "чотириста", "п'ятсот", "шістсот", "сімсот", "вісімсот", "дев'ятсот" ];
  unit = [['копейка', 'копейки', 'копеек', 1], ['рубль', 'рубля', 'рублей', 0], ['тисяча', 'тисячі', 'тисяч', 1], ['мільйон', 'мільйони', 'мільйонів', 0], ['миллиард', 'милиарда', 'миллиардов', 0]];
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
  return out.join(' ').replace(RegExp(' {2,}', 'g'), ' ').trim();
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
