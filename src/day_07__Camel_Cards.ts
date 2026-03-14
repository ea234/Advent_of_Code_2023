import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * https://adventofcode.com/2023/day/7
 *
 * 
 */

const CARD_STRENGTH_A : number = 13;
const CARD_STRENGTH_K : number = 12;
const CARD_STRENGTH_Q : number = 11;
const CARD_STRENGTH_J : number = 10;
const CARD_STRENGTH_T : number = 9;
const CARD_STRENGTH_9 : number = 8;
const CARD_STRENGTH_8 : number = 7;
const CARD_STRENGTH_7 : number = 6;
const CARD_STRENGTH_6 : number = 5;
const CARD_STRENGTH_5 : number = 4;
const CARD_STRENGTH_4 : number = 3;
const CARD_STRENGTH_3 : number = 2;
const CARD_STRENGTH_2 : number = 1;

const HAND_TYPE_FIVE_OF_A_KIND  : number = 7;
const HAND_TYPE_FOUR_OF_A_KIND  : number = 6;
const HAND_TYPE_FULL_HOUSE      : number = 5;
const HAND_TYPE_THREE_OF_A_KIND : number = 4;
const HAND_TYPE_TWO_PAIRS       : number = 3;
const HAND_TYPE_ONE_PAIR        : number = 2;
const HAND_TYPE_HIGH_CARD       : number = 1;

const HAND_TYPE_TRUE : number = 1;
const HAND_TYPE_FALSE : number = 0;

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


function checkHand( pInput : string ) : number
{
    let r_card_count : Record< string, number > = {};

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
    }

    let freq_of_two : number = 0;
    let freq_of_four : number = 0;
    let freq_of_five : number = 0;
    let freq_of_three : number = 0;

    /*
     * Calculating pairs
     */
    for (const [key, value] of Object.entries(r_card_count)) 
    {
             if ( value == 2 ) { freq_of_two++;   }
        else if ( value == 3 ) { freq_of_three++; }
        else if ( value == 4 ) { freq_of_four++;  }
        else if ( value == 5 ) { freq_of_five++;  }
      
       console.log(`Key: ${key}, Count: ${value}`);
    }

    console.log( "\ncheckHand -----------------------------------------");
    console.log( pInput );
    console.log( r_card_count );

    console.log( "freq_of_two   =>" + freq_of_two + "<" );
    console.log( "freq_of_four  =>" + freq_of_four + "<" );
    console.log( "freq_of_five  =>" + freq_of_five + "<" );
    console.log( "freq_of_three =>" + freq_of_three + "<" );

    if ( freq_of_five === 1 ) { return HAND_TYPE_FIVE_OF_A_KIND; }

    if ( freq_of_four === 1 ) { return HAND_TYPE_FOUR_OF_A_KIND; }

    if (( freq_of_three === 1 ) && ( freq_of_two === 1 ))  { return HAND_TYPE_FULL_HOUSE; }

    if ( freq_of_three === 1 ) { return HAND_TYPE_THREE_OF_A_KIND; }

    if ( freq_of_two === 2 )  { return HAND_TYPE_TWO_PAIRS; }

    if ( freq_of_two === 1 )  { return HAND_TYPE_ONE_PAIR; }

    return HAND_TYPE_HIGH_CARD;
}

console.log( "Day 07 - Camel Cards" );

checkHand( "T55J5" );
checkHand("KK677");
checkHand("KKKAA");
checkHand("22344");

//calcArray( getTestArray() );

//checkReaddatei();



