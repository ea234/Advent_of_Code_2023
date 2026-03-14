import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * https://adventofcode.com/2023/day/7
 *
 * 
 * /home/ea234/.nvm/versions/node/v20.16.0/bin/node ./dist/day07/day_07__Camel_Cards.js
 * Day 07 - Camel Cards
 * Key: 5, Count: 3
 * Key: T, Count: 1
 * Key: J, Count: 1
 * 
 * checkHand -----------------------------------------
 * T55J5
 * {5: 3, T: 1, J: 1}
 * hand_sort_value =>WW_<
 * freq_of_two     =>0<
 * freq_of_four    =>0<
 * freq_of_five    =>0<
 * freq_of_three   =>1<
 * Key: 6, Count: 1
 * Key: 7, Count: 2
 * Key: K, Count: 2
 * 
 * checkHand -----------------------------------------
 * KK677
 * {6: 1, 7: 2, K: 2}
 * hand_sort_value =>VV_LLEFF<
 * freq_of_two     =>2<
 * freq_of_four    =>0<
 * freq_of_five    =>0<
 * freq_of_three   =>0<
 * Key: K, Count: 3
 * Key: A, Count: 2
 * 
 * checkHand -----------------------------------------
 * KKKAA
 * {K: 3, A: 2}
 * hand_sort_value =>XX_LLLMM<
 * freq_of_two     =>1<
 * freq_of_four    =>0<
 * freq_of_five    =>0<
 * freq_of_three   =>1<
 * Key: 2, Count: 2
 * Key: 3, Count: 1
 * Key: 4, Count: 2
 * 
 * checkHand -----------------------------------------
 * 22344
 * {2: 2, 3: 1, 4: 2}
 * hand_sort_value =>VV_AABCC<
 * freq_of_two     =>2<
 * freq_of_four    =>0<
 * freq_of_five    =>0<
 * freq_of_three   =>0<
 * 
 */

const STR_CARD_STRENGTH_A : string           = "M";
const STR_CARD_STRENGTH_K : string           = "L";
const STR_CARD_STRENGTH_Q : string           = "K";
const STR_CARD_STRENGTH_J : string           = "J";
const STR_CARD_STRENGTH_T : string           = "I";
const STR_CARD_STRENGTH_9 : string           = "H";
const STR_CARD_STRENGTH_8 : string           = "G";
const STR_CARD_STRENGTH_7 : string           = "F";
const STR_CARD_STRENGTH_6 : string           = "E";
const STR_CARD_STRENGTH_5 : string           = "D";
const STR_CARD_STRENGTH_4 : string           = "C";
const STR_CARD_STRENGTH_3 : string           = "B";
const STR_CARD_STRENGTH_2 : string           = "A";

const STR_HAND_TYPE_FIVE_OF_A_KIND  : string = "zz_";
const STR_HAND_TYPE_FOUR_OF_A_KIND  : string = "YY_";
const STR_HAND_TYPE_FULL_HOUSE      : string = "XX_";
const STR_HAND_TYPE_THREE_OF_A_KIND : string = "WW_";
const STR_HAND_TYPE_TWO_PAIRS       : string = "VV_";
const STR_HAND_TYPE_ONE_PAIR        : string = "UU_";
const STR_HAND_TYPE_HIGH_CARD       : string = "TT_";


class Hand 
{
    m_input_string : string;

    m_hand: string;

    m_bid : string;

    constructor ( pInput : string )
    {
        const [ hand, bid ] = pInput.trim().split( /\s+/ );

        this.m_input_string = pInput;

        this.m_hand = ( hand ?? "" ).trim();
        
        this.m_bid = (bid ?? "").trim();
    }

    public getCardNr( pIndex : number ) : string
    {
        if ( this.m_hand ) 
        {
            return this.m_hand[ pIndex ] ?? "";
        }

        return "";
    }
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
      console.log( cur_input_str );
    }

    console.log( "" );
    console.log( "" );
    console.log( "Result Part 1 = " + result_part_01 );
    console.log( "Result Part 2 = " + result_part_02 );
}


async function readFileLines(): Promise<string[]> 
{
    const filePath: string = "/home/ea234/typescript/advent_of_code_2023__day07_input.txt";

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

    array_test.push( "32T3K 765" );
    array_test.push( "T55J5 684" );
    array_test.push( "KK677 28" );
    array_test.push( "KTJJT 220" );
    array_test.push( "QQQJA 483" );

    return array_test;
}

function calcHandSortValue( pInput : string ) : string 
{
    let r_card_count : Record< string, number > = {};
    let r_card_strength : Record< string, string > = {};

    r_card_strength[ "A" ] = STR_CARD_STRENGTH_A;
    r_card_strength[ "K" ] = STR_CARD_STRENGTH_K;
    r_card_strength[ "Q" ] = STR_CARD_STRENGTH_Q;
    r_card_strength[ "J" ] = STR_CARD_STRENGTH_J;
    r_card_strength[ "T" ] = STR_CARD_STRENGTH_T;
    r_card_strength[ "9" ] = STR_CARD_STRENGTH_9;
    r_card_strength[ "8" ] = STR_CARD_STRENGTH_8;
    r_card_strength[ "7" ] = STR_CARD_STRENGTH_7;
    r_card_strength[ "6" ] = STR_CARD_STRENGTH_6;
    r_card_strength[ "5" ] = STR_CARD_STRENGTH_5;
    r_card_strength[ "4" ] = STR_CARD_STRENGTH_4;
    r_card_strength[ "3" ] = STR_CARD_STRENGTH_3;
    r_card_strength[ "2" ] = STR_CARD_STRENGTH_2;

    let hand_sort_value : string  = "";

    /*
     * Calculating the frequenzy of cards
     *
     * T55J5 = { 5: 3, T: 1, J: 1 }
     * 
     */
    for (let index = 0; index < 5; index++) 
    { 
        let card_key = pInput[ index ] ?? "NV";


        r_card_count[ card_key ] = (r_card_count[ card_key ] ?? 0 ) + 1;

        hand_sort_value += r_card_strength[ card_key ];
    }

    let freq_of_two : number = 0;
    let freq_of_four : number = 0;
    let freq_of_five : number = 0;
    let freq_of_three : number = 0;

    /*
     * Calculating pairs
     *
     * T55J5 = { 5: 3, T: 1, J: 1 }
     * 
     */
    for (const [key, value] of Object.entries(r_card_count)) 
    {
             if ( value == 2 ) { freq_of_two++;  }
        else if ( value == 3 ) { freq_of_three++; }
        else if ( value == 4 ) { freq_of_four++;  }
        else if ( value == 5 ) { freq_of_five++;  }
      
       console.log(`Key: ${key}, Count: ${value}`);
    }

    if ( freq_of_five === 1 ) { hand_sort_value = STR_HAND_TYPE_FIVE_OF_A_KIND + hand_sort_value; }

    else if ( freq_of_four === 1 ) { hand_sort_value = STR_HAND_TYPE_FOUR_OF_A_KIND + hand_sort_value; }

    else if (( freq_of_three === 1 ) && ( freq_of_two === 1 ))  { hand_sort_value = STR_HAND_TYPE_FULL_HOUSE + hand_sort_value; }

    else if ( freq_of_three === 1 ) { hand_sort_value = STR_HAND_TYPE_THREE_OF_A_KIND; + hand_sort_value; }

    else if ( freq_of_two === 2 )  { hand_sort_value = STR_HAND_TYPE_TWO_PAIRS + hand_sort_value; }

    else if ( freq_of_two === 1 )  { hand_sort_value = STR_HAND_TYPE_ONE_PAIR + hand_sort_value; }

    else { hand_sort_value = STR_HAND_TYPE_HIGH_CARD + hand_sort_value; }

    console.log( "\ncheckHand -----------------------------------------");
    console.log( pInput );
    console.log( r_card_count );
    console.log( "hand_sort_value =>" + hand_sort_value + "<" );
    console.log( "freq_of_two     =>" + freq_of_two + "<" );
    console.log( "freq_of_four    =>" + freq_of_four + "<" );
    console.log( "freq_of_five    =>" + freq_of_five + "<" );
    console.log( "freq_of_three   =>" + freq_of_three + "<" );

    return hand_sort_value;
}

console.log( "Day 07 - Camel Cards" );

calcHandSortValue( "T55J5" );
calcHandSortValue( "KK677" );
calcHandSortValue( "KKKAA" );
calcHandSortValue( "22344" );

//calcArray( getTestArray() );

//checkReaddatei();


