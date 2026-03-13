import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * https://adventofcode.com/2023/day/6
 *
 * /home/ea234/.nvm/versions/node/v20.16.0/bin/node ./dist/day06/day_06__Wait_for_It.js
 * 
 * Day 06 - Wait For It
 * 
 * --------------------------------------------------
 * 
 * Race Nr. 0, Max Milliseconds 7, Distance 9
 * 
 *  Speed 0 Time Left 7 = Distance 0
 *  Speed 1 Time Left 6 = Distance 6
 *  Speed 2 Time Left 5 = Distance 10
 *  Speed 3 Time Left 4 = Distance 12
 *  Speed 4 Time Left 3 = Distance 12
 *  Speed 5 Time Left 2 = Distance 10
 *  Speed 6 Time Left 1 = Distance 6
 *  Speed 7 Time Left 0 = Distance 0
 * 
 * --------------------------------------------------
 * 
 * Race Nr. 1, Max Milliseconds 15, Distance 40
 * 
 *  Speed 0 Time Left 15 = Distance 0
 *  Speed 1 Time Left 14 = Distance 14
 *  Speed 2 Time Left 13 = Distance 26
 *  Speed 3 Time Left 12 = Distance 36
 *  Speed 4 Time Left 11 = Distance 44
 *  Speed 5 Time Left 10 = Distance 50
 *  Speed 6 Time Left 9 = Distance 54
 *  Speed 7 Time Left 8 = Distance 56
 *  Speed 8 Time Left 7 = Distance 56
 *  Speed 9 Time Left 6 = Distance 54
 *  Speed 10 Time Left 5 = Distance 50
 *  Speed 11 Time Left 4 = Distance 44
 *  Speed 12 Time Left 3 = Distance 36
 *  Speed 13 Time Left 2 = Distance 26
 *  Speed 14 Time Left 1 = Distance 14
 *  Speed 15 Time Left 0 = Distance 0
 * 
 * --------------------------------------------------
 * 
 * Race Nr. 2, Max Milliseconds 30, Distance 200
 * 
 *  Speed 0 Time Left 30 = Distance 0
 *  Speed 1 Time Left 29 = Distance 29
 *  Speed 2 Time Left 28 = Distance 56
 *  Speed 3 Time Left 27 = Distance 81
 *  Speed 4 Time Left 26 = Distance 104
 *  Speed 5 Time Left 25 = Distance 125
 *  Speed 6 Time Left 24 = Distance 144
 *  Speed 7 Time Left 23 = Distance 161
 *  Speed 8 Time Left 22 = Distance 176
 *  Speed 9 Time Left 21 = Distance 189
 *  Speed 10 Time Left 20 = Distance 200
 *  Speed 11 Time Left 19 = Distance 209
 *  Speed 12 Time Left 18 = Distance 216
 *  Speed 13 Time Left 17 = Distance 221
 *  Speed 14 Time Left 16 = Distance 224
 *  Speed 15 Time Left 15 = Distance 225
 *  Speed 16 Time Left 14 = Distance 224
 *  Speed 17 Time Left 13 = Distance 221
 *  Speed 18 Time Left 12 = Distance 216
 *  Speed 19 Time Left 11 = Distance 209
 *  Speed 20 Time Left 10 = Distance 200
 *  Speed 21 Time Left 9 = Distance 189
 *  Speed 22 Time Left 8 = Distance 176
 *  Speed 23 Time Left 7 = Distance 161
 *  Speed 24 Time Left 6 = Distance 144
 *  Speed 25 Time Left 5 = Distance 125
 *  Speed 26 Time Left 4 = Distance 104
 *  Speed 27 Time Left 3 = Distance 81
 *  Speed 28 Time Left 2 = Distance 56
 *  Speed 29 Time Left 1 = Distance 29
 *  Speed 30 Time Left 0 = Distance 0
 * 
 * 
 * Race Nr 0  Record beaten 4 times   => Result Part 1 1
 * Race Nr 1  Record beaten 8 times   => Result Part 1 4
 * Race Nr 2  Record beaten 9 times   => Result Part 1 32
 * 
 * (3) [4, 8, 9]
 * 
 * Result Part 1 = 288
 * Result Part 2 = 0
 * 
 */

function getNumberArray( pString: string ): number[] 
{
    return pString.trim().split( /\s+/ ).map( Number );
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


    let time_string : string = "";
    let distance_string : string = "";

    for ( const cur_input_str of pArray ) 
    {
        if ( cur_input_str.startsWith("Time:")  )
        {
            time_string = cur_input_str.substring( 6 );
        }
        else if ( cur_input_str.startsWith("Distance:")  )
        {
            distance_string = cur_input_str.substring( 10 );
        }
    }

    let time_array     : number[] = getNumberArray( time_string );
    let distance_array : number[] = getNumberArray( distance_string );
    let result_array   : number[] = getNumberArray( distance_string );

    /*
     * *******************************************************************************************************
     * Calculating Part 1
     * *******************************************************************************************************
     */

    for ( let cur_index = 0; cur_index < time_array.length; cur_index++ )
    {
        let max_milliseconds : number = time_array[ cur_index ] ?? 0;
        let max_distance_old : number = distance_array[ cur_index ] ?? 0;

        let counter_record_beaten : number = 0;

        console.log( "\n--------------------------------------------------\n ");
        console.log( "Race Nr. " + cur_index + ", Max Milliseconds " + max_milliseconds + ", Distance " + max_distance_old + "\n");

        for ( let cur_ms : number = 0; cur_ms <= max_milliseconds; cur_ms++)
        {
            let speed_per_ms : number = cur_ms;

            let time_left    : number = max_milliseconds - cur_ms;

            let distance_c   : number = speed_per_ms * time_left;

            if ( distance_c > max_distance_old )
            {
                counter_record_beaten++;
            }

            console.log( " Speed " + speed_per_ms + " Time Left " + time_left + " = Distance " + distance_c );
        }

        result_array[ cur_index ] = counter_record_beaten;
    }

    console.log( "" );
    console.log( "" );

    result_part_01 = 1;

    for ( let cur_index = 0; cur_index < time_array.length; cur_index++ )
    {
        console.log( "Race Nr " + cur_index + "  Record beaten " + result_array[ cur_index ] + " times   => Result Part 1 " + result_part_01);

        result_part_01 = result_part_01 * ( result_array[ cur_index ] ?? 1 );
    }

    console.log( "" );
    console.log( result_array );
    console.log( "" );
    console.log( "Result Part 1 = " + result_part_01 );
    console.log( "Result Part 2 = " + result_part_02 );
}

async function readFileLines(): Promise<string[]> 
{
    const filePath: string = "/home/ea234/typescript/advent_of_code_2023__day06_input.txt";

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


function getTestArray(): string[] 
{
    const array_test: string[] = [];

    array_test.push( "Time:      7  15   30" );
    array_test.push( "Distance:  9  40  200" );

    return array_test;
}


console.log( "Day 06 - Wait For It" );

calcArray( getTestArray() );

//checkReaddatei();



