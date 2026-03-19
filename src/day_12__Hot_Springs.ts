import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * https://adventofcode.com/2023/day/12
 * 
 * 
 */

function getNumberArray( pString: string ): number[] 
{
    return pString.trim().split( /,+/ ).map( Number );
}


function construktA( pArray : number[] ) : string 
{
    let str_result = "";

    for ( const nr_arr of pArray )
    {
        str_result += "#".repeat( nr_arr );
        str_result += ".";
    }

    return str_result;
}

function calcArray( pArray: string[] ): void 
{
    /*
     * *******************************************************************************************************
     * Initializing the array
     * *******************************************************************************************************
     */
    let result_part_01: number = 0;

    let result_part_02: number = 0;

    let lr_rule : string = "";

    let array_map_nodes_a : string[] = [];

    for ( const cur_input_str of pArray ) 
    {
        if ( cur_input_str !== "" )
        {
            const [ a, b ] = cur_input_str.split( " " );

            let output = a!.replace(/\.{2,}/g, ".").replace(/^\./, "");

            if ( output.endsWith( "." ) )
            {
                output = output.slice( 0, output.length -1 );
            }

            const num_arr = getNumberArray( b! );

            console.log( "" );
            console.log( "A " + a + "  B " + b + "  output " + output );
            console.log( num_arr.toString() + " " + construktA( num_arr ) );


            

/*



A ???.###              B 1,1,3    output ???.###
A .??..??...?##.       B 1,1,3    output .??.??.?##.
A ?#?#?#?#?#?#?#?      B 1,3,1,6  output ?#?#?#?#?#?#?#?
A ????.#...#...        B 4,1,1    output ????.#.#.
A ????.######..#####.  B 1,6,5    output ????.######.#####.
A ?###????????         B 3,2,1    output ?###????????

?#?#?#?#?#?#?#?  B 1,3,1,6

Regel 1
- Punkte sind Trennzeichen 
- Aufeinander folgende Punkte koennen zu einem Punkt reduziert werden.

Regel 2
- Entferne führende und trailing punkte

Regel 3
- Erstelle ein Array mit den Punkten als Trennzeichen
- das ergibt die Sektionen mit nicht funktionierenden Bädern

Regel 4
?? - 1 =  .#
          #.

??? - 1 = ..#
          .#.
          #..

?? - 2 = ##

??? - 2 = .##
          #.#
          ##.

          



  

"????.######..#####. 1,6,5"
Erstelle ein Muster
Punkte aus dem original werden übersprungen.
Punkte sorgen dafür, dass zum nächsten index des musters gesprungen werden muss.
Ein punkt ist ein funktionierendes bad
Falsch: da in den ? auch Punkte stehen können.


Eliminiere dabei schon funktionierende Kombinationen 
zaehle die Anzahl der freien felder
zaehler die Anzahl der # felder (bekannte zustände)

"????.######..#####. 1,6,5"
"#.???.######..#####. 1,6,5"


*/            
        }

//        console.log( cur_input_str );
    }

    /*
     * *******************************************************************************************************
     * Calculating Part 1
     * *******************************************************************************************************
     */

    console.log( "- END -" );
}


async function readFileLines(): Promise<string[]> 
{
    const filePath: string = "/home/ea234/typescript/advent_of_code_2023__day12_input.txt";

    const lines: string[] = [];

    const fileStream = await fs.open( filePath, 'r' ).then( handle => handle.createReadStream() );

    const rl = readline.createInterface( { input: fileStream, crlfDelay: Infinity } );

    for await ( const line of rl ) {
        lines.push( line );
    }

    rl.close();

    fileStream.destroy();

    return lines;
}


function checkReaddatei(): void 
{
    ( async () => {

        const arrFromFile = await readFileLines();

        calcArray( arrFromFile );
    } )();
}


function getTestArray1(): string[] 
{
    const array_test: string[] = [];

    array_test.push( "???.### 1,1,3" );
    array_test.push( ".??..??...?##. 1,1,3" );
    array_test.push( "?#?#?#?#?#?#?#? 1,3,1,6" );
    array_test.push( "????.#...#... 4,1,1" );
    array_test.push( "????.######..#####. 1,6,5" );
    array_test.push( "?###???????? 3,2,1" );

    return array_test;
}

console.log( "Day 12 - Hot Springs" );

calcArray( getTestArray1() );

//checkReaddatei();

const input = "......??..##........?#?....??......?##.";
const output = input.replace(/\.{2,}/g, "_");
console.log( output );
// output: ".??.??.?##."