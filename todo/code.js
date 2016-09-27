function listMissingLetters( str) {
	if (str !== undefined) {
		console.log(str);
		var allLetters = 'abcdefghijklmnopqrstuvwxyz';
		str = str.trim();
		for (var i = 0; i < allLetters.length; i++) {
			if(str.indexOf(allLetters[i]) !== -1){
				allLetters = allLetters.replace(allLetters[i], '');
				i-=1;

			}
		}
		console.log('letters needed for pangram: "'+ allLetters+ '"') ;

	}
	
}

function  explode( bombs,  force){
	if (bombs.length > 0 && bombs.length < 51 && force <11 && force > 0) {
		var time = bombs.length;
		var output = [bombs];
		var str = bombs;
		var ans = '';
		for (var i = 0; i < bombs.length; i++) {
			ans+= '.';
		}
		var count = 0;

		while(  str!= ans){
					var tempStr =str;
			for (var i = 0; i < str.length; i++) {


				if (str[i] === 'B') {
					str = str.replaceAt(i , ".");
					tempStr = tempStr.replaceAt(i, ".");
					tempStr = exp(tempStr,i, force, 'right');
					tempStr = exp(tempStr, i, force, 'left');
				} if (str[i]==='>') {
					str = str.replaceAt(i , ".");
					tempStr = tempStr.replaceAt(i, ".");

					tempStr = exp(tempStr,i , force, 'right');
				}else if (str[i] === '<') {
					str = str.replaceAt(i , ".");
					tempStr = tempStr.replaceAt(i, ".");

					tempStr = exp(tempStr, force, 'left');	
				}else if (str[i]==="X") {
					str = str.replaceAt(i , ".");
					tempStr = tempStr.replaceAt(i, ".");
					tempStr = exp(tempStr, i, force, 'right');
					tempStr = exp(tempStr,i ,  force, 'left');	
				}
				

			}
			str = tempStr;
			output.push(tempStr);

		}

		console.log(output);

	}
}

function exp( b,i , f, dir) {
	var str = '', opt= '';
	if (dir === "right"){
		f = f*1;
		str = ">";
		opt = "<";

	}else if (dir === "left"){
		f = f*-1;
		str = "<";
		opt = ">"
	}
	if ((i+f)< b.length && (i+f) >= 0) {
		if(b[i+f]  === opt){
			b = b.replaceAt(i+f, "X")

		}else {
			b = b.replaceAt(i+f, str)
		}


	}

	return b;		
}
String.prototype.replaceAt=function(index, character) {
    return this.substr(0, index) + character + this.substr(index+character.length);
}


listMissingLetters("A quick brown fox jumps over the lazy dog");
explode("..B....", 2)
explode("..B.B..B", 1)