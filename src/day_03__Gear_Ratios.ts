import { promises as fs } from 'fs';
import * as readline from 'readline';

type PropertieMap = Record<string, string>;


function checkForSymbol( pHashMap: PropertieMap, pRow: number, pCol: number ): boolean {

    const symbols_char_list = [ '$', '/', '*', '+', '=', '&', '%', '#', '@', '-', '*', '#', '-', '+', '$', '@', '+', '$', '%', '+', '$', '+', '*', '=', '#', '%', '/', '@', '&', '$', '-' ];


    if ( symbols_char_list.includes( pHashMap[ "R" + ( pRow - 1 ) + "C" + ( pCol - 1 ) ] ?? "." ) ) return true;
    if ( symbols_char_list.includes( pHashMap[ "R" + ( pRow - 1 ) + "C" + pCol         ] ?? "." ) ) return true;
    if ( symbols_char_list.includes( pHashMap[ "R" + ( pRow - 1 ) + "C" + ( pCol + 1 ) ] ?? "." ) ) return true;

    if ( symbols_char_list.includes( pHashMap[ "R" + pRow + "C" + ( pCol - 1 ) ] ?? "." ) ) return true;
    if ( symbols_char_list.includes( pHashMap[ "R" + pRow + "C" + ( pCol + 1 ) ] ?? "." ) ) return true;

    if ( symbols_char_list.includes( pHashMap[ "R" + ( pRow + 1 ) + "C" + ( pCol - 1 ) ] ?? "." ) ) return true;
    if ( symbols_char_list.includes( pHashMap[ "R" + ( pRow + 1 ) + "C" + pCol         ] ?? "." ) ) return true;
    if ( symbols_char_list.includes( pHashMap[ "R" + ( pRow + 1 ) + "C" + ( pCol + 1 ) ] ?? "." ) ) return true;

    return false;
}


function getNumber( pHashMap: PropertieMap, pRow: number, pCol: number ): number {

    let cur_col = pCol;

    let cur_char: string = pHashMap[ "R" + pRow + "C" + cur_col ] ?? " ";

    /*
     * Find the start of the number
     */
    while ( cur_char >= '0' && cur_char <= '9' ) 
    {
        cur_col--;

        cur_char = pHashMap[ "R" + pRow + "C" + cur_col ] ?? ".";
    }

    cur_col++;

    /*
     * Get the Number
     */

    let result_nr: string = "0";

    cur_char = pHashMap[ "R" + pRow + "C" + cur_col ] ?? ".";

    while ( cur_char >= '0' && cur_char <= '9' ) 
    {
        result_nr += cur_char;

        cur_col++;

        cur_char = pHashMap[ "R" + pRow + "C" + cur_col ] ?? ".";
    }

    return Number( result_nr );
}


function checkForNumber( pHashMap: PropertieMap, pRow: number, pCol: number ): boolean 
{
    const number_char_list = [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9' ];

    return ( number_char_list.includes( pHashMap[ "R" + pRow + "C" + ( pCol ) ] ?? "." ) );
}


function checkNumber( pHashMap: PropertieMap, pRow: number, pCol: number ): number {

    let knz_above_number_1: boolean = checkForNumber( pHashMap, pRow - 1, pCol - 1 );
    let knz_above_number_2: boolean = checkForNumber( pHashMap, pRow - 1, pCol );
    let knz_above_number_3: boolean = checkForNumber( pHashMap, pRow - 1, pCol + 1 );

    let knz_left_number: boolean = checkForNumber( pHashMap, pRow, pCol - 1 );
    let knz_right_number: boolean = checkForNumber( pHashMap, pRow, pCol + 1 );

    let knz_bottom_number_1: boolean = checkForNumber( pHashMap, pRow + 1, pCol - 1 );
    let knz_bottom_number_2: boolean = checkForNumber( pHashMap, pRow + 1, pCol );
    let knz_bottom_number_3: boolean = checkForNumber( pHashMap, pRow + 1, pCol + 1 );

    let above_number_1: number = 0;
    let above_numer_2: number = 0;
    let bottom_number_1: number = 0;
    let bottom_number_2: number = 0;
    let number_left: number = 0;
    let number_right: number = 0;

    if ( knz_left_number ) 
    {
        number_left = getNumber( pHashMap, pRow, pCol - 1 ); 
    }

    if ( knz_right_number ) 
    {
        number_right = getNumber( pHashMap, pRow, pCol + 1 ); 
    }

    if ( knz_above_number_1 && knz_above_number_2 && knz_above_number_3 ) 
    {
        above_number_1 = getNumber( pHashMap, pRow - 1, pCol - 1 ); 
    }
    else if ( knz_above_number_1 && !knz_above_number_2 && !knz_above_number_3 ) 
    {
        above_number_1 = getNumber( pHashMap, pRow - 1, pCol - 1 ); 
    }
    else if ( !knz_above_number_1 && !knz_above_number_2 && knz_above_number_3 ) 
    {
        above_number_1 = getNumber( pHashMap, pRow - 1, pCol + 1 ); 
    }
    else if ( knz_above_number_1 && !knz_above_number_2 && knz_above_number_3 ) 
    {
        above_number_1 = getNumber( pHashMap, pRow - 1, pCol - 1 ); 

        above_numer_2 = getNumber( pHashMap, pRow - 1, pCol + 1 ); 
    }
    else if ( knz_above_number_1 ) 
    {
        above_number_1 = getNumber( pHashMap, pRow - 1, pCol - 1 ); 
    }
    else if ( knz_above_number_2 ) 
    {
        above_number_1 = getNumber( pHashMap, pRow - 1, pCol ); 
    }

    if ( knz_bottom_number_1 && knz_bottom_number_2 && knz_bottom_number_3 ) 
    {
        bottom_number_1 = getNumber( pHashMap, pRow + 1, pCol - 1 ); 
    }
    else if ( knz_bottom_number_1 && !knz_bottom_number_2 && !knz_bottom_number_3 ) 
    {
        bottom_number_1 = getNumber( pHashMap, pRow + 1, pCol - 1 ); 
    }
    else if ( !knz_bottom_number_1 && !knz_bottom_number_2 && knz_bottom_number_3 ) 
    {
        bottom_number_1 = getNumber( pHashMap, pRow + 1, pCol + 1 ); 
    }
    else if ( knz_bottom_number_1 && !knz_bottom_number_2 && knz_bottom_number_3 ) 
    {
        bottom_number_1 = getNumber( pHashMap, pRow + 1, pCol - 1 ); 

        bottom_number_2 = getNumber( pHashMap, pRow + 1, pCol + 1 ); 
    }
    else if ( knz_bottom_number_2 ) 
    {
        bottom_number_1 = getNumber( pHashMap, pRow + 1, pCol ); 
    }

    //console.log( " nr_1 " + above_number_1 + "  nr_2 " + above_numer_2 + "  nr_b1 " + bottom_number_1 + "  nr_b2 " + bottom_number_2 + "  nr_left " + number_left + "   nr_right " + number_right );

    let number_1: number = 0;
    let number_2: number = 0;

    let nr_arr: number[] = [ above_number_1, above_numer_2, bottom_number_1, bottom_number_2, number_left, number_right ];

    for ( let i = 0; i < nr_arr.length; i++ ) 
    {
        if ( nr_arr[ i ] !== 0 ) 
        {
            if ( number_1 == 0 ) { number_1 = nr_arr[ i ] ?? 0; }
            else if ( number_2 == 0 ) { number_2 = nr_arr[ i ] ?? 0; }
        }
    }

    if ( ( number_1 > 0 ) && ( number_2 > 0 ) ) 
    {
        console.log( " number_1 " + number_1 + " number_1 " + number_1 + "  = " + ( number_1 * number_2 ) );

        return number_1 * number_2;
    }

    console.log( " number_1 " + number_1 + " number_1 " + number_1 + "  = 0 " );

    return 0;
}


function calcArray( pArray: string[] ): void 
{
    /*
     * *******************************************************************************************************
     * Initializing the grid
     * *******************************************************************************************************
     */
    let result_part_01: number = 0;

    let result_part_02: number = 0;

    let hash_map: PropertieMap = {};

    let grid_rows: number = 0;
    let grid_cols: number = 0;

    for ( const cur_input_str of pArray ) {

        for ( let cur_col1 = 0; cur_col1 < cur_input_str.length; cur_col1++ ) {

            grid_cols = cur_col1;

            let cur_char_input: string = cur_input_str[ grid_cols ] ?? ".";

            let hash_map_key = "R" + grid_rows + "C" + grid_cols;

            hash_map[ hash_map_key ] = cur_char_input;
        }

        grid_rows++;
    }

    grid_cols++;

    /*
     * *******************************************************************************************************
     * Calculating Part 1
     * *******************************************************************************************************
     */

    console.log( "" );

    let cur_number: number = 0;
    let cur_number_ok: boolean = true;

    for ( let cur_row: number = 0; cur_row < grid_rows; cur_row++ ) 
    {
        for ( let cur_col: number = 0; cur_col < grid_cols; cur_col++ ) 
        {
            let cur_char = hash_map[ "R" + cur_row + "C" + cur_col ] ?? " ";

            /*
             * Check for Number
             */

            if ( cur_char >= '0' && cur_char <= '9' ) 
            {
                /*
                 * Add Up the numbers
                 */
                cur_number = ( cur_number * 10 ) + Number( cur_char );

                /*
                 * Check for Symbol if needed
                 */
                if ( !cur_number_ok ) {
                    cur_number_ok = checkForSymbol( hash_map, cur_row, cur_col );
                }
            }
            else 
            {
                if ( ( cur_number > 0 ) && ( cur_number_ok ) ) 
                {
                    result_part_01 += cur_number;
                }

                cur_number = 0;
                cur_number_ok = false;
            }
        }
    }

    /*
     * *******************************************************************************************************
     * Calculating Part 2
     * *******************************************************************************************************
     */

    for ( let cur_row: number = 0; cur_row < grid_rows; cur_row++ ) {

        for ( let cur_col: number = 0; cur_col < grid_cols; cur_col++ ) {

            let cur_char = hash_map[ "R" + cur_row + "C" + cur_col ] ?? " ";

            if ( cur_char === '*' ) {
                result_part_02 += checkNumber( hash_map, cur_row, cur_col );
            }
        }
    }

    console.log( "" );
    console.log( "Result Part 1 = " + result_part_01 );
    console.log( "Result Part 2 = " + result_part_02 );
}

async function readFileLines(): Promise<string[]> {

    const filePath: string = "/home/ea234/typescript/advent_of_code_2023__day03_input.txt";

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

    array_test.push( "467..114.." );
    array_test.push( "...*......" );
    array_test.push( "..35..633." );
    array_test.push( "......#..." );
    array_test.push( "617*......" );
    array_test.push( ".....+.58." );
    array_test.push( "..592....." );
    array_test.push( "......755." );
    array_test.push( "...$.*...." );
    array_test.push( ".664.598.." );

    return array_test;
}

console.log( "Day 03 - Gear Ratios" );

//calcArray( getTestArray() );

checkReaddatei();



