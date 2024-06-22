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

function cmpcode ( a,b )
{
	return  a[0] - b[0];
}

function LearnThis ( Cell, HowMany )
{
	var L = Cell.innerHTML;
	var ThisWord;
	if ( HowMany == 5 )
	{
		ThisWord = L + L + L + L + L;
	}
	else
	{
		ThisWord = L;
	}

	// console.log ( ThisWord );

	const AudioContext = window.AudioContext || window.webkitAudioContext;
	audio = new AudioContext();
	const compressor = audio.createDynamicsCompressor();
	compressor.connect(audio.destination);

	// DotMS = 60000 / ( 50 * SpeedWPM );
	DotMS = 60000 / ( 50 * 10 );
	DashMS = 3 * DotMS;
	IntraMS = DotMS;
	InterMS = 3 * DotMS;
	WordMS = 7 * DotMS;

	Farnsworth = 1;
	when = 0.1;

	SendWord ( ThisWord );
}

function LearnProsign ( Cell )
{
	var ThisWord = Cell.innerHTML;
	var ThisCode = 'unknown';
	for ( var ndx = 0; ndx < ProsignCount; ndx++ )
	{
		if ( Prosigns[ndx][0] == ThisWord )
		{
			ThisCode = Prosigns[ndx][1];
			break;
		}
	}

	console.log ( ThisWord + ' ' + ThisCode );

	const AudioContext = window.AudioContext || window.webkitAudioContext;
	audio = new AudioContext();
	const compressor = audio.createDynamicsCompressor();
	compressor.connect(audio.destination);

	// DotMS = 60000 / ( 50 * SpeedWPM );
	DotMS = 60000 / ( 50 * 10 );
	DashMS = 3 * DotMS;
	IntraMS = DotMS;
	InterMS = 3 * DotMS;
	WordMS = 7 * DotMS;

	Farnsworth = 1;
	when = 0.1;

	for ( var xs = 0; xs < ThisCode.length; xs++ )
	{
		if ( ThisCode[xs] == '.' )
		{
			(new SoundPlayer(audio)).play(frequency, 1.0, type, when).stop(when+DotMS/1000.0);
			when += (DotMS+IntraMS)/1000.0;
		}
		else
		{
			(new SoundPlayer(audio)).play(frequency, 1.0, type, when).stop(when+DashMS/1000.0);
			when += (DashMS+IntraMS)/1000.0;
		}
	}
}

function CheatSheet ()
{
	elemLearn.innerHTML = '<img src="MorseCode.png">';
}

function LearnLetters ()
{
	var ndx;

	var myString = '<p>Click on the letter to hear the morse code.<br>Code will be repeated five times.<p>';
	myString += "<table border='1' cellpadding='3' cellspacing='0'>";

	CodeBook.sort(cmpcode);

	for ( ndx = 0; ndx < CodeBook.length; ndx += 2 )
	{
		if ( CodeBook[ndx][0] >= 'A' &&  CodeBook[ndx][0] <= 'Z' )
		{
			myString += '<tr>';
			myString += '<td onclick="LearnThis(this,5);">' + CodeBook[ndx][0] + '</td><td>' + CodeBook[ndx][1] + '</td>';
			myString += '<td onclick="LearnThis(this,5);">' + CodeBook[ndx+1][0] + '</td><td>' + CodeBook[ndx+1][1] + '</td>';
			myString += '</tr>';
		}
	}

	myString += '</table>';
	elemLearn.innerHTML = myString;
}

function LearnNumbers ()
{
	var ndx;
	var myString = '<p>Click on the number to hear the morse code.<br>Code will be repeated five times.<p>';
	myString += "<table border='1' cellpadding='3' cellspacing='0'>";

	CodeBook.sort(cmpcode);

	for ( ndx = 0; ndx < CodeBook.length; ndx++ )
	{
		if ( CodeBook[ndx][0] == '0' )
		{
			break;
		}
	}
	for ( ; ndx < CodeBook.length; ndx += 2 )
	{
		if ( CodeBook[ndx][0] >= '0' &&  CodeBook[ndx][0] <= '9' )
		{
			myString += '<tr>';
			myString += '<td onclick="LearnThis(this,5);">' + CodeBook[ndx][0] + '</td><td>' + CodeBook[ndx][1] + '</td>';
			myString += '<td onclick="LearnThis(this,5);">' + CodeBook[ndx+1][0] + '</td><td>' + CodeBook[ndx+1][1] + '</td>';
			myString += '</tr>';
		}
	}

	myString += '</table>';
	elemLearn.innerHTML = myString;
}

function LearnPunctuation ()
{
	var myString = "<table border='1' cellpadding='3' cellspacing='0'>";
	var ndx;
	var myString = '<p>Click on the number to hear the morse code.<br>Code will be repeated five times.<p>';
	myString += "<table border='1' cellpadding='3' cellspacing='0'>";

	CodeBook.sort(cmpcode);

	for ( var ndx = 0; ndx < CodeBook.length; ndx++ )
	{
		if ( CodeBook[ndx][0] >= 'A' &&  CodeBook[ndx][0] <= 'Z' )
		{
			continue;
		}
		if ( CodeBook[ndx][0] >= '0' &&  CodeBook[ndx][0] <= '9' )
		{
			continue;
		}
		myString += '<tr>';
		myString += '<td onclick="LearnThis(this,5);">' + CodeBook[ndx][0] + '</td><td>' + CodeBook[ndx][1] + '</td>';
		myString += '</tr>';
	}

	myString += '</table>';
	elemLearn.innerHTML = myString;
}

function LearnProsigns ()
{
	var myString = '<p>Click on the Prosign to hear the morse code.<br>';
	myString += "More information about Prosigns, Common Abbreviations and Wire Signs at ";
	myString += "<a target='_blank' href='https://the-daily-dabble.com/morse-code-abbreviations'>The Daily Dabble</a> and ";
	myString += "<a target='_blank' href='https://en.wikipedia.org/wiki/Prosigns_for_Morse_code'>Wikipedia</a><br>";

	myString += "<p><table border='1' cellpadding='3' cellspacing='0'>";

	// this does not work for who knows why?
	// Prosigns.sort(cmpcode);

	for ( var ndx = 0; ndx < Prosigns.length; ndx++ )
	{
		myString += '<tr>';
		myString += '<td onclick="LearnProsign(this);">' + Prosigns[ndx][0] + '</td><td>' + Prosigns[ndx][1] + '</td><td>' + Prosigns[ndx][2] + '</td>';
		myString += '</tr>';
	}

	myString += '</table>';
	elemLearn.innerHTML = myString;
}

function LearnAbbreviations ()
{
	var myString  = '<p>Click on the abbreviation to hear the morse code.<br>';
	myString += 'Notice that abbreviations as individual letters.';
	myString += "<p><table border='1' cellpadding='3' cellspacing='0'>";

	for ( var ndx = 0; ndx < AbbreviationCount; ndx++ )
	{
		myString += '<tr>';

		myString += '<td onclick="LearnThis(this,1);">' + Abbreviations[ndx][0] + '</td><td>' + Abbreviations[ndx][1] + '</td>';
		myString += '</tr>';
	}

	myString += '</table>';
	elemLearn.innerHTML = myString;
}

var	elemLearn;

function ChangeFrequency ()
{
	frequency =  Number(document.getElementById('UserFreq').value);
}

function LearnSomething ()
{
	frequency =  Number(document.getElementById('UserFreq').value);

	elemLearn = document.getElementById('Learn');

	var elem1 = document.getElementById ( 'CheatSheet' );
	var elem2 = document.getElementById ( 'LearnLetters');
	var elem3 = document.getElementById ( 'LearnNumbers' );
	var elem4 = document.getElementById ( 'LearnPucntuation' );
	var elem5 = document.getElementById ( 'LearnProsigns' );
	var elem6 = document.getElementById ( 'LearnAbbreviations' );

	if ( elem1.checked )
	{
		CheatSheet ();
	}
	else if ( elem2.checked )
	{
		LearnLetters ();
	}
	else if ( elem3.checked )
	{
		LearnNumbers ();
	}
	else if ( elem4.checked )
	{
		LearnPunctuation ();
	}
	else if ( elem5.checked )
	{
		LearnProsigns ();
	}
	else if ( elem6.checked )
	{
		LearnAbbreviations ();
	}
	else 
	{
		elemLearn.innerHTML = '<p>Please select something above and try again!<p>';
	}
}
