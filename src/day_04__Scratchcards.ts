import { promises as fs } from 'fs';
import * as readline from 'readline';

type PropertieMap = Record<string, string>;

function getNumberArray( pString : string ) : number[]
{
  return pString.trim().split(/\s+/).map(Number);
}

function calcArray( pArray: string[] ): void 
{
    /*
     * *******************************************************************************************************
     * Initializing 
     * *******************************************************************************************************
     */
    let result_part_01: number = 0;

    let result_part_02: number = 0;

    for ( const cur_input_str of pArray ) {

        console.log( cur_input_str );

        const parts = cur_input_str.split( ":" ); 

        const afterColon = parts.length > 1 ? parts[1] ?? "" : cur_input_str.trim();

        const segments = afterColon.split("|").map(s => s.trim());

        let numbers_wining : number[] = getNumberArray( segments[0] ?? "" );

        let numbers_you    : number[] = getNumberArray( segments[1] ?? "" );

        let point_a = 0;

        for (const value_you of numbers_you) 
        { 
            if ( numbers_wining.includes( value_you ) )
            {
                if ( point_a == 0 )
                {
                    point_a = 1;
                }
                else
                {
                    point_a = point_a * 2;
                }

                console.log( value_you + " " + point_a );
            }
         }

         console.log( point_a );

         result_part_01 += point_a;
    }

    console.log( "" );
    console.log( "Result Part 1 = " + result_part_01 );
    console.log( "Result Part 2 = " + result_part_02 );
}

async function readFileLines(): Promise<string[]> {

    const filePath: string = "/home/ea234/typescript/advent_of_code_2023__day04_input.txt";

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

function getTestArray(): string[] {

    const array_test: string[] = [];

    array_test.push( "Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53");
    array_test.push( "Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19");
    array_test.push( "Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1");
    array_test.push( "Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83");
    array_test.push( "Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36");
    array_test.push( "Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11");

    return array_test;
}

console.log( "Day 04 - Scratchcards" );

//calcArray( getTestArray() );

checkReaddatei();



