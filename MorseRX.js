//     Morse Code Practice
// 
//     Copyright (C)  2024 Tom Stevelt
// 
//     This program is free software: you can redistribute it and/or modify
//     it under the terms of the GNU Affero General Public License as
//     published by the Free Software Foundation, either version 3 of the
//     License, or (at your option) any later version.
// 
//     This program is distributed in the hope that it will be useful,
//     but WITHOUT ANY WARRANTY; without even the implied warranty of
//     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//     GNU Affero General Public License for more details.
// 
//     You should have received a copy of the GNU Affero General Public License
//     along with this program.  If not, see <https://www.gnu.org/licenses/>.

// from: https://www.the-art-of-web.com/javascript/creating-sounds/

var Farnsworth = 1;
var WordCount = 3;
var Contents = 'W';
var MadeCount = 0;
var MadeArray = new Array ();

function MakeWords ( SourceArray, SourceCount, WordCount )
{
	console.log ( 'MakeWords: SourceCount = ' + SourceCount );

	MadeCount = 0

	for ( W = 0; W < WordCount; W++ )
	{
		MyString = '';
		for ( L = 0; L < 5; L++ )
		{
			x = 2147483648 * SineRandom ();
			x = x % SourceCount;
			x = Math.floor ( x );
			if ( typeof SourceArray[x] == 'undefined' )
			{
				console.log ( x + ' is undefined' );
			}
			else
			{
				MyString += SourceArray[x] ;
			}
		}
		MadeArray[MadeCount] = MyString;
		MadeCount++;
	}
}

function startRX()
{
	document.getElementById('UserInput').value = '';;
	document.getElementById('UserInput').focus();
	document.getElementById('resultsRX').innerHTML = '';;

	const AudioContext = window.AudioContext || window.webkitAudioContext;
	audio = new AudioContext();
	const compressor = audio.createDynamicsCompressor();
	compressor.connect(audio.destination);

	SpeedWPM = document.getElementById('SpeedWPM').value;
	WordCount = document.getElementById('WordCount').value;
	Farnsworth = document.getElementById('Farnsworth').value;
	Contents = document.getElementById('Contents').value;

	DotMS = 60000 / ( 50 * SpeedWPM );
	DashMS = 3 * DotMS;
	IntraMS = DotMS;
	InterMS = 3 * DotMS;
	WordMS = 7 * DotMS;

	console.log ( 'SpeedWPM ' + SpeedWPM + ' DotMS ' + DotMS );

	SineSeed = new Date().getTime();
	console.log ( 'startRX: SineSeed ' + SineSeed );

	if ( Contents == 'W' )
	{
		for ( var ndx = 0; ndx < Words.length; ndx++ )
		{
			Words[ndx][1] = SineRandom();
		}

		Words.sort(cmprec);

		for ( var ndx = 0; ndx < WordCount;  ndx++ )
		{
			MadeArray[ndx] = Words[ndx][0];
		}
		MadeCount = WordCount;
	}
	else if ( Contents == 'R' )
	{
		MakeWords ( Letters, 26, WordCount );
	}
	else if ( Contents == 'N' )
	{
		MakeWords ( Letters, 36, WordCount );
	}
	else if ( Contents == 'A' )
	{
		MakeWords ( Letters, Letters.length, WordCount );
	}
	else if ( Number(Contents) >= 1 && Number(Contents) <= 41 )
	{
		console.log ( 'Koch length = ' + Koch.length );
		MakeWords ( Koch, Number(Contents), WordCount );
	}
	else
	{
		console.log ( 'Contents ' + Contents + ' not done' );
		return;
	}

	for ( var ndx = 0; ndx < MadeCount;  ndx++ )
	{
		console.log ( MadeArray[ndx] );
		SendWord ( MadeArray[ndx] );
	}

	when = 1.0;
}

function checkRX()
{
	var UserInput = document.getElementById('UserInput').value;
	TotalCount = 0;
	ErrorCount = 0;

	console.log ( UserInput );

	// word boundaries do not work for Koch 
	// var UserWords = UserInput.split(/\s*\b\s*/);
	var UserWords = UserInput.split(" ");

	console.log ( UserWords );

	var myString = '<table cellpadding="2"><tr><td>RX</td><td>Copy</td><td align="right">Errors</td></tr>';

	for ( var ndx = 0; ndx < MadeCount;  ndx++ )
	{
		var Errors = 0;
		TotalCount += MadeArray[ndx].length;

		for ( var xp = 0; xp < MadeArray[ndx].length; xp++ )
		{
			if ( MadeArray[ndx][xp] != UserWords[ndx][xp] )
			{
				Errors++;
				ErrorCount++;
			}
		}

		myString += '<tr><td>' + MadeArray[ndx] + '</td><td>' + UserWords[ndx] + '</td><td align="right">' + Errors + '</td></tr>';
	}

	var Percent = 100.0 * (TotalCount - ErrorCount) / TotalCount;
	myString += '<tr><td colspan="2">Score</td><td align="right">' + Percent.toFixed(0) + '%</td></tr>';

	myString += '</table>';

	document.getElementById('resultsRX').innerHTML = myString;
}
