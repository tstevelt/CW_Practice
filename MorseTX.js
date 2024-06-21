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

var StartTime = 0;
var EndTime;
var DownTime;
var elemDone;
var Mid = 0;
var DotDashArray = new Array();
var audio_started = false;

function StartClock()
{
	StartTime = new Date().getTime();
	DotDashArray = new Array();
	ErrorCount = 0;

	if ( typeof elemDone == 'undefined' )
	{
		elemDone = document.getElementById('buttonDone');
	}
	elemDone.disabled = false;
}

function StopClock()
{
	EndTime = new Date().getTime();
	var MilliSeconds = 0;
	var Seconds = 1.1;
	var Minutes = 1.1;
	if ( StartTime == 0 )
	{
		StartTime = EndTime - 100;
	}
	MilliSeconds = EndTime - StartTime;
	Seconds = MilliSeconds / 1000.0;
	Minutes = Seconds / 60.0;
	var WPM = 20.0 / Minutes;
	StartTime = 0;

	// console.log ( DotDashArray );

	var Min = 999999;
	var Max = 0;
	for ( var ndx = 0; ndx < DotDashArray.length; ndx++ )
	{
		if ( DotDashArray[ndx] < Min )
		{
			Min = DotDashArray[ndx];
		}
		if ( DotDashArray[ndx] > Max )
		{
			Max = DotDashArray[ndx];
		}
	}
	Mid = (Min + Max) / 2;
	
	var Dots = DotDashArray.filter(GetDots);
	var Dashes = DotDashArray.filter(GetDashes);

	// console.log ( Dots );
	// console.log ( Dashes );

	var DotsAvg = 0;
	var DashesAvg = 0;
	for ( var ndx = 0; ndx < DotDashArray.length; ndx++ )
	{
		if ( DotDashArray[ndx] < Mid )
		{
			DotsAvg += DotDashArray[ndx];
		}
		else
		{
			DashesAvg += DotDashArray[ndx];
		}
	}
	DotsAvg /= Dots.length;
	DashesAvg /= Dashes.length;
	var Ratio = DashesAvg / DotsAvg;

	// console.log ( DotsAvg.toFixed(2) + ' ' + DashesAvg.toFixed(2) + ' ' + Ratio.toFixed(2) );

	var DotsSD  = stddev ( Dots, Dots.length );
	var DashesSD  = stddev ( Dashes, Dashes.length );

	// console.log ( DotsSD.toFixed(2) + ' ' + DashesSD.toFixed(2) );

	var DotsPct = 100.0 * DotsSD / DotsAvg;
	var DashesPct = 100.0 * DashesSD / DashesAvg;
	// console.log ( DotsPct.toFixed(2) + ' ' + DashesPct.toFixed(2) );


	var elemStats = document.getElementById('stats');

	elemStats.innerHTML  = 'Minutes ' + Minutes.toFixed(2) + '<br>';
	elemStats.innerHTML += 'Words/Minute ' + WPM.toFixed(2) + '<br>';
	elemStats.innerHTML += 'Average Dot ' + DotsAvg.toFixed(2) + '<br>';
	elemStats.innerHTML += 'Average Dash ' + DashesAvg.toFixed(2) + '<br>';
	elemStats.innerHTML += 'Dash/Dot Ratio ' + Ratio.toFixed(2) + '<br>';
	elemStats.innerHTML += 'Dot SD % ' + DotsPct.toFixed(2) + '<br>';
	elemStats.innerHTML += 'Dash SD % ' + DashesPct.toFixed(2) + '<br>';
	elemStats.innerHTML += 'Errors ' + ErrorCount + '<br>';

	elemDone.disabled = true;

}

function GetDots(DotDashArray)
{
	return ( DotDashArray < Mid );
}

function GetDashes(DotDashArray)
{
	return ( DotDashArray >= Mid );
}

function stddev ( Array, Count )
{
	var	Mean = 0.0;
	var	SumDiffSq = 0.0;
	var	rv;

	for ( var i = 0; i < Count; i++ )
	{
		Mean += Array[i];
	}
	Mean = Mean / Count;

	for ( i = 0; i < Count; i++ )
	{
		SumDiffSq += Math.pow(Array[i] - Mean,2);
	}

	rv = Math.sqrt ( SumDiffSq / Count );

	return ( rv );
}

function down () {
	if (!audio_started) {
		init_audio();
	}
	audioCtx.resume();
	gainNode.gain.value = 0.1;

	if ( StartTime == 0 )
	{
		StartClock();
		ClearStats();
	}
	DownTime = new Date().getTime();
}

function up () {
	audioCtx.resume();
	gainNode.gain.value = 0.0;
	var Interval = new Date().getTime() - DownTime;
	DotDashArray.push(Interval);
}

document.onkeydown = function(evt) {
    evt = evt || window.event;
    if ("key" in evt) {
        if (evt.key == "E" || evt.key == "e" ) 
		{
			// console.log ( 'E' );
			ErrorCount++;
		}
		else if (evt.key == 'D' || evt.key == 'd' )
		{
			// console.log ( 'D' );
			StopClock();
		}
    } 
}

function init_audio () {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    oscillator = audioCtx.createOscillator();
    biquadFilter = audioCtx.createBiquadFilter();
    gainNode = audioCtx.createGain();
    biquadFilter.type = "lowpass";
    biquadFilter.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    biquadFilter.Q.setValueAtTime(15, audioCtx.currentTime);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime); // value in hertz

    oscillator.connect(gainNode);
    gainNode.connect(biquadFilter);
    biquadFilter.connect(audioCtx.destination);

    oscillator.start();

    gainNode.gain.value = 0;

	audioCtx.resume();
    audio_started = true;
}

function ClearStats ()
{
	var elemStats = document.getElementById('stats');
	elemStats.innerHTML = '';
}

function LoadWords ( HowMany )
{
	var MaxWords = WordCount;

	ClearStats ();
	// console.clear();

	SineSeed = new Date().getTime();
	// console.log ( 'LoadWords: SineSeed ' + SineSeed );
	for ( var ndx = 0; ndx < Words.length; ndx++ )
	{
		Words[ndx][1] = SineRandom();
	}

	Words.sort(cmprec);

	var elemWordList = document.getElementById("WordList");
	elemWordList.innerHTML = "";
	for ( var ndx = 0; ndx < HowMany; ndx++ )
	{
		if ( ndx > 0 && ndx % 5 == 0 )
		{
			elemWordList.innerHTML += "<br>";
		}

		elemWordList.innerHTML += " " + Words[ndx][0];

		// console.log ( Words[ndx][0] + ' '+ Words[ndx][1] );
	}

	document.getElementById('TrackPad').focus();

	elem1 = document.getElementById ( 'FiveLetterWords' );
	elem1.checked = true;
}

function LoadCodes ( HowMany )
{
	var	W, L, X;

	ClearStats ();

	SineSeed = new Date().getTime();

	var elemWordList = document.getElementById("WordList");
	var MyString = "<table border='0' cellspacing='0' cellpadding='3'><tr>";

	for ( W = 0; W < HowMany; W++ )
	{
		if ( W > 0 && W % 5 == 0 )
		{
			// console.log ( 'end of row' );
			MyString += '</tr><tr>';
		}

		
		MyString += '<td>';
		// console.log ( W + ' ' + 'start cell' );
		for ( L = 0; L < 5; L++ )
		{
			x = 2147483648 * SineRandom ();
			x = x % 26;
			x = Math.floor ( x );
			MyString += Letters[x] ;
		}

		MyString += '</td>';
		// console.log ( 'end cell' );
	}
	MyString += '</tr></table>';
	// console.log ( MyString );
	elemWordList.innerHTML = MyString;

	// console.log ( elemWordList.innerHTML );

	document.getElementById('TrackPad').focus();
}

var lengths_okay = 0;

function FindLetter ()
{
	var	 rv = 0;

	while ( 1 )
	{
		rv = ((CodeBook.length - 1) * SineRandom() ).toFixed(0);
		Character = CodeBook[rv][0];
		if ( Character >= 'A' && Character <= 'Z' )
		{
			break;
		}
	}
	return ( rv );
}

function FindNumber ()
{
	var	 rv = 0;

	while ( 1 )
	{
		rv = ((CodeBook.length - 1) * SineRandom() ).toFixed(0);
		Character = CodeBook[rv][0];
		if ( Character >= '0' && Character <= '9' )
		{
			break;
		}
	}
	return ( rv );
}

function FindPunct ()
{
	var	 rv = 0;

	while ( 1 )
	{
		rv = ((CodeBook.length - 1) * SineRandom() ).toFixed(0);
		Character = CodeBook[rv][0];
		if ( Character >= 'A' && Character <= 'Z' )
		{
			continue;
		}
		if ( Character >= '0' && Character <= '9' )
		{
			continue;
		}
		break;
	}
	return ( rv );
}

function SetCodeBookLengths ()
{
	for ( var ndx = 0; ndx < CodeBook.length; ndx++ )
	{
		var len = 0;
		for ( var xp = 0; xp < CodeBook[ndx][1].length; xp++ )
		{
			if ( CodeBook[ndx][1][xp] == '.' )
			{
				len += 1;
			}
			else if ( CodeBook[ndx][1][xp] == '-' )
			{
				len += 3;
			}
			else
			{
				console.log ( 'systax error' );
				return;
			}

			len += 1;
		}
		len += 2;
		CodeBook[ndx][2] = len;
		// console.log ( CodeBook[ndx][0] + ' ' + CodeBook[ndx][1] + ' ' + CodeBook[ndx][2] );
	}
}	

function LoadVariable ()
{
	if ( lengths_okay == 0 )
	{
		SetCodeBookLengths ();
		lengths_okay = 1;
	}
	
	var Sentence = "";
	var TotalDots = 0;
	var ThisDots = 0;
	var WordIndex = 0;

	while ( TotalDots < 1000 )
	{
		WordIndex = ((Variable.length - 1) * SineRandom ()).toFixed(0);

		ThisDots = 0;

		for ( var xl = 0; xl < Variable[WordIndex][0].length; xl++ )
		{
			for ( var ndx = 0; ndx < CodeBook.length; ndx++ )
			{
				if ( CodeBook[ndx][0].toLowerCase() == Variable[WordIndex][0][xl].toLowerCase() )
				{
					Sentence += Variable[WordIndex][0][xl];
					ThisDots += CodeBook[ndx][2];
					break;
				}
			}

			if ( TotalDots + ThisDots > 1000 )
			{
				break;
			}
		}

		ThisDots += 4;
		Sentence += ' ';

		TotalDots += ThisDots;

		// console.log ( Variable[WordIndex][0] + ' ' + ThisDots + ' ' + TotalDots );
	}

	// console.log ( "total dots " + TotalDots );

	var elemWordList = document.getElementById("WordList");
	elemWordList.innerHTML = '<p>' + Sentence + '<p>';
}

function LoadSentence ()
{
	if ( lengths_okay == 0 )
	{
		SetCodeBookLengths ();
		lengths_okay = 1;
	}
	
	var Sentence = '';
	var probNumber = 0.1;
	var probPunct = 0.05;
	var TotalDots = 0;
	var flip;
	var CodeIndex;
	var Character;
	var CharType;
	var CharCount = (10.0 * SineRandom ()).toFixed(0);

	while ( TotalDots < 1000 )
	{
		flip = SineRandom();	
		// console.log ( flip );
		if ( flip < probPunct )
		{
			CodeIndex = FindPunct ();
		}
		else if ( flip < probNumber )
		{
			CodeIndex = FindNumber ();
		}
		else
		{
			CodeIndex = FindLetter ();
		}

		Sentence += CodeBook[CodeIndex][0];
		TotalDots += CodeBook[CodeIndex][2];

		CharCount--;
		if ( CharCount <= 0 )
		{
			Sentence += ' ';
			TotalDots += 4;

			// console.log ( 'running dots ' + TotalDots );

			CharCount = (10.0 * SineRandom ()).toFixed(0);
		}
	}

	TotalDots += 4;
	// console.log ( 'final dots ' + TotalDots );

	// console.log ( Sentence );
	// console.log ( "total dots " + TotalDots );

	var elemWordList = document.getElementById("WordList");
	elemWordList.innerHTML = '<p>' + Sentence + '<p>';
}

function LoadSomething ( )
{
	var HowMany = 20;

	var elem1 = document.getElementById ( 'FiveLetterWords' );
	var elem2 = document.getElementById ( 'FiveLetterCodes');
	var elem3 = document.getElementById ( 'CommonWordSentence' );
	var elem4 = document.getElementById ( 'CodedSentence' );

	if ( elem1.checked )
	{
		LoadWords ( HowMany );
	}
	else if ( elem2.checked )
	{
		LoadCodes ( HowMany );
	}
	else if ( elem3.checked )
	{
		LoadVariable ();
	}
	else if ( elem4.checked )
	{
		LoadSentence ();
	}
	else
	{
		var elemWordList = document.getElementById("WordList");
		elemWordList.innerHTML = '<p>Please select something above and try again!<p>';
	}
}
