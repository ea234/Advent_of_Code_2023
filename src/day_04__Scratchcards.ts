import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * /home/ea234/.nvm/versions/node/v20.16.0/bin/node ./dist/day04/day_04__Scratchcards.js
 * Day 04 - Scratchcards
 * 
 * ------------------------------------------------------------
 * 
 * Card 1 B 41 48 83 86 17  C 83 86  6 31 17  9 48 53
 * Winning Number 83  1
 * Winning Number 86  2
 * Winning Number 17  4
 * Winning Number 48  8
 * scratchcard_point_value 8
 * Card Number 1 wins 4
 * Nr 1 Card-Number 2 total 2
 * Nr 2 Card-Number 3 total 2
 * Nr 3 Card-Number 4 total 2
 * Nr 4 Card-Number 5 total 2
 * 
 * ------------------------------------------------------------
 * 
 * Card 2 B 13 32 20 16 61  C 61 30 68 82 17 32 24 19
 * Winning Number 61  1
 * Winning Number 32  2
 * scratchcard_point_value 2
 * Card Number 2 wins 2
 * Nr 1 Card-Number 3 total 4
 * Nr 2 Card-Number 4 total 4
 * 
 * ------------------------------------------------------------
 * 
 * Card 3 B 1 21 53 59 44  C 69 82 63 72 16 21 14  1
 * Winning Number 21  1
 * Winning Number 1  2
 * scratchcard_point_value 2
 * Card Number 3 wins 2
 * Nr 1 Card-Number 4 total 8
 * Nr 2 Card-Number 5 total 6
 * 
 * ------------------------------------------------------------
 * 
 * Card 4 B 41 92 73 84 69  C 59 84 76 51 58  5 54 83
 * Winning Number 84  1
 * scratchcard_point_value 1
 * Card Number 4 wins 1
 * Nr 1 Card-Number 5 total 14
 * 
 * ------------------------------------------------------------
 * 
 * Card 5 B 87 83 26 28 32  C 88 30 70 12 93 22 82 36
 * scratchcard_point_value 0
 * Card Number 5 wins 0
 * 
 * ------------------------------------------------------------
 * 
 * Card 6 B 31 18 13 56 72  C 74 77 10 23 35 67 36 11
 * scratchcard_point_value 0
 * Card Number 6 wins 0
 * 
 * 
 * ------------------------------------------------------------
 * 
 * 
 *  Card-Number 1 number of cards = 1
 *  Card-Number 2 number of cards = 2
 *  Card-Number 3 number of cards = 4
 *  Card-Number 4 number of cards = 8
 *  Card-Number 5 number of cards = 14
 *  Card-Number 6 number of cards = 1
 * 
 * Result Part 1 = 13
 * Result Part 2 = 30
 */
type PropertieCardCount = Record<number, number>;


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

    let total_number_of_scratchcards: PropertieCardCount = {};

    /*
     * *******************************************************************************************************
     * Setting all original Cards to 1 
     * *******************************************************************************************************
     */

    for ( const cur_input_str of pArray ) 
    {
        const match = cur_input_str.match( /Card\s+(\d+):/ );

        const card_nr: number = match ? Number( match[ 1 ] ) : 0;

        total_number_of_scratchcards[ card_nr ] = 1;
    }

    /*
     * *******************************************************************************************************
     * Calculating Part 1 and the totals of won cards
     * *******************************************************************************************************
     */

    for ( const cur_input_str of pArray ) 
    {
        const parts = cur_input_str.split( ":" );

        const afterColon = parts.length > 1 ? parts[ 1 ] ?? "" : cur_input_str.trim();

        const segments = afterColon.split( "|" ).map( s => s.trim() );

        let numbers_wining: number[] = getNumberArray( segments[ 0 ] ?? "" );

        let numbers_you_have: number[] = getNumberArray( segments[ 1 ] ?? "" );

        console.log( "\n------------------------------------------------------------\n" );
        console.log( "" + parts[ 0 ] + " B " + segments[ 0 ] + "  C " + segments[ 1 ] );

        let scratchcard_point_value = 0;

        let count_winning_numbers = 0;

        for ( const value_you of numbers_you_have ) 
        {
            if ( numbers_wining.includes( value_you ) ) 
            {
                count_winning_numbers++;

                if ( scratchcard_point_value == 0 ) 
                {
                    scratchcard_point_value = 1;
                }
                else 
                {
                    scratchcard_point_value = scratchcard_point_value * 2;
                }

                console.log( "Winning Number " + value_you + "  " + scratchcard_point_value );
            }
        }

        console.log( "scratchcard_point_value " + scratchcard_point_value );

        result_part_01 += scratchcard_point_value;

        const match = cur_input_str.match( /Card\s+(\d+):/ );

        const card_nr: number = match ? Number( match[ 1 ] ) : 0;

        /*
         * How many copies of the current card have been won
         */
        const card_multiplicator: number = Number( total_number_of_scratchcards[ card_nr ] ?? 0 );

        console.log( "Card Number " + card_nr + " wins " + count_winning_numbers );

        for ( let nr = 1; nr <= count_winning_numbers; nr++ ) 
        {
            total_number_of_scratchcards[ card_nr + nr ] = ( total_number_of_scratchcards[ card_nr + nr ] ?? 0 ) + card_multiplicator;

            console.log( "Nr " + nr + " Card-Number " + ( card_nr + nr ) + " total " + total_number_of_scratchcards[ card_nr + nr ] );
        }
    }

    /*
     * *******************************************************************************************************
     * Calculating Part 2
     * *******************************************************************************************************
     */

    console.log( "\n------------------------------------------------------------\n" );

    for ( const card_nr in total_number_of_scratchcards ) 
    {
        console.log( " Card-Number " + card_nr  + " number of cards = " + total_number_of_scratchcards[ card_nr ] );

        result_part_02 += ( ( total_number_of_scratchcards[ card_nr ] ?? 0 ) );
    }

    /*
     * *******************************************************************************************************
     * Calculating Part 2
     * *******************************************************************************************************
     */


    console.log( "" );
    console.log( "Result Part 1 = " + result_part_01 );
    console.log( "Result Part 2 = " + result_part_02 );
}

async function readFileLines(): Promise<string[]> 
{
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


function getTestArray(): string[] 
{
    const array_test: string[] = [];

    array_test.push( "Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53" );
    array_test.push( "Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19" );
    array_test.push( "Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1" );
    array_test.push( "Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83" );
    array_test.push( "Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36" );
    array_test.push( "Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11" );

    return array_test;
}


console.log( "Day 04 - Scratchcards" );

calcArray( getTestArray() );

//checkReaddatei();



