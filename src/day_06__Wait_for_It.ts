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
 * ---------------------------------------------------------------------------------------------
 * 
 * PART 2
 * 
 * Calc Nr. 0  speed_for_distance 1.2857142857142858  hat NK true next int 2
 * Calc Nr. 1  speed_for_distance 1.8  hat NK true next int 2
 * 
 * Race Time        7
 * Distance to beat 9
 * Button Push Time 2
 * From             2
 * To               5
 * Diff Time        4
 * 
 * --------------------------------------------------
 * 
 * Calc Nr. 0  speed_for_distance 2.6666666666666665  hat NK true next int 3
 * Calc Nr. 1  speed_for_distance 3.3333333333333335  hat NK true next int 4
 * Calc Nr. 2  speed_for_distance 3.6363636363636362  hat NK true next int 4
 * 
 * Race Time        15
 * Distance to beat 40
 * Button Push Time 4
 * From             4
 * To               11
 * Diff Time        8
 * 
 * --------------------------------------------------
 * 
 * Calc Nr. 0  speed_for_distance 6.666666666666667  hat NK true next int 7
 * Calc Nr. 1  speed_for_distance 8.695652173913043  hat NK true next int 9
 * Calc Nr. 2  speed_for_distance 9.523809523809524  hat NK true next int 10
 * Calc Nr. 3  speed_for_distance 10  hat NK false next int 10
 * 
 * Race Time        30
 * Distance to beat 200
 * Button Push Time 10
 * From             10
 * To               20
 * Diff Time        11 <------- Wrong
 * 
 * --------------------------------------------------
 * 
 * Calc Nr. 0  speed_for_distance 13.144135327834475  hat NK true next int 14
 * Calc Nr. 1  speed_for_distance 13.146708428883047  hat NK true next int 14
 * 
 * Race Time        71530
 * Distance to beat 940200
 * Button Push Time 14
 * From             14
 * To               71516
 * Diff Time        71503
 * Day 06 - Wait For It
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


function calcPart2( pTime : number,  pDistance : number) : void
{
    console.log( "\n--------------------------------------------------\n ");

    let result_time_button_push : number = 0;

    let time_current = pTime;

    for ( let calc_nr = 0; calc_nr < 50; calc_nr++ )
    {
        const speed_for_distance = pDistance / time_current;

        const time_button_push = Math.ceil(speed_for_distance); 

        const time_new_for_distance = pTime - time_button_push; 

        const speed_is_integer : boolean = !Number.isInteger(speed_for_distance);

        console.log( "Calc Nr. " + calc_nr + "  speed_for_distance " + speed_for_distance + "  hat NK " +  speed_is_integer + " next int " + time_button_push  );

        if ( !speed_is_integer )
        {
            result_time_button_push = time_button_push;
            
            break;
        }

        if (( time_current - time_new_for_distance ) == 0 )
        {
            result_time_button_push = time_button_push;
            break;
        }

        time_current = time_new_for_distance;
    }

    let time_remaining_distance : number = pTime - ( result_time_button_push * 2 );


    console.log( "" );
    console.log( "Race Time        " + pTime );
    console.log( "Distance to beat " + pDistance );
    console.log( "Button Push Time " + result_time_button_push );
    console.log( "From             " +  result_time_button_push );
    console.log( "To               " + (pTime - result_time_button_push) );
    console.log( "Diff Time        " + ((pTime - ( result_time_button_push * 2 )) + 1 ));
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

calcPart2( 7, 9 );
calcPart2( 15, 40 );
calcPart2( 30, 200 );
calcPart2( 71530, 940200 );

//calcArray( getTestArray() );

//checkReaddatei();



