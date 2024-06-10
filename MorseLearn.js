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

function LearnThis ( Cell )
{
	var L = Cell.innerHTML;
	var ThisWord = L + L + L + L + L;
	console.log ( ThisWord );

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

function PaintLearn ()
{
	var	elemLearn = document.getElementById('Learn');
	var myString = "<table border='1' cellpadding='3' cellspacing='0'>";
	var ndx;

	CodeBook.sort(cmpcode);

	// letters
	for ( ndx = 0; ndx < CodeBook.length; ndx += 2 )
	{
		if ( CodeBook[ndx][0] >= 'A' &&  CodeBook[ndx][0] <= 'Z' )
		{
			myString += '<tr>';
			myString += '<td onclick="LearnThis(this);">' + CodeBook[ndx][0] + '</td><td>' + CodeBook[ndx][1] + '</td>';
			myString += '<td onclick="LearnThis(this);">' + CodeBook[ndx+1][0] + '</td><td>' + CodeBook[ndx+1][1] + '</td>';
			myString += '</tr>';
		}
	}
	
	// numbers
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
			myString += '<td onclick="LearnThis(this);">' + CodeBook[ndx][0] + '</td><td>' + CodeBook[ndx][1] + '</td>';
			myString += '<td onclick="LearnThis(this);">' + CodeBook[ndx+1][0] + '</td><td>' + CodeBook[ndx+1][1] + '</td>';
			myString += '</tr>';
		}
	}

	// other
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
		myString += '<td onclick="LearnThis(this);">' + CodeBook[ndx][0] + '</td><td>' + CodeBook[ndx][1] + '</td>';
		myString += '</tr>';
	}
	

	myString += '</table>';
	elemLearn.innerHTML = myString;
}
