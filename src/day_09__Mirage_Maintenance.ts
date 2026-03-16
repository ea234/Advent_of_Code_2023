import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * https://adventofcode.com/2023/day/9
 * 
 * 
 * /home/ea234/.nvm/versions/node/v20.16.0/bin/node ./dist/day09/day_09__Mirage_Maintenance.js
 * Day 09 - Mirage Maintenance
 * 
 * ------------------------------------------------------------
 * 
 * 0 3 6 9 12 15
 *          3            3  (         0) =          3
 *         12           15  (         3) =         18
 * 
 * 
 * 0   3   6   9  12  15  18
 *   3   3   3   3   3   3
 *     0   0   0   0   0
 * 
 * ------------------------------------------------------------
 * 
 * 1 3 6 10 15 21
 *          1            1  (         0) =          1
 *          5            6  (         1) =          7
 *         15           21  (         7) =         28
 * 
 * 1   3   6  10  15  21  28
 *   2   3   4   5   6   7
 *     1   1   1   1   1
 *       0   0   0   0
 * 
 * 
 * ------------------------------------------------------------
 * 
 * 10 13 16 21 30 45
 *          2            2  (         0) =          2
 *          4            6  (         2) =          8
 *          9           15  (         8) =         23
 *         30           45  (        23) =         68
 * 
 * Result Part 1 = 114
 * Result Part 2 = 0
 * 
 * 
 * 
 */


function pad( pInput : string | number, pPadLeft : number ) : string 
{
    let str_result : string = pInput.toString();

    while (str_result.length < pPadLeft)
    { 
        str_result = " " + str_result;
    }

    return str_result;
}


function getNumberArray( pString : string ): number[] 
{
    return pString.trim().split( /\s+/ ).map( Number );
}


function calcDiffRowRec( pInput : string ) : number 
{
    /*
     * Create an number-array from the input
     */
    let array_numbers : number[] = getNumberArray( pInput );

    /*
     * String for the new difference values (only debug)
     */
    let str_new_row : string = "";


    /*
     * Flag, that all new values are 0.
     *
     * You cant use an additive value and check that for 0.
     * 10 + (-10) = 0
     */
    let knz_all_0 : boolean = true;

    /*
     * Calculate the new difference row
     */
    for ( let index_cur = 0; index_cur < ( array_numbers.length - 1 ); index_cur++ )
    {
        let diff_cur : number = array_numbers[ index_cur + 1 ]! - array_numbers[ index_cur ]!;

        str_new_row += " " + diff_cur;

        if ( diff_cur !== 0 )
        {
            knz_all_0 = false;
        }
    }

    /*
     * If no recursion occurs, the diff_from_recursion is 0.
     * If a recursion is neccessary, the diff_from_recursion-value 
     * will be the last number from the numbers array.
     */
    let diff_from_recursion : number = 0;

    if ( knz_all_0 === false )
    {
        diff_from_recursion = calcDiffRowRec( str_new_row );
    }

    /*
     * New Number = last element from the number-array plus the value from the recursion.
     */
    let new_number = array_numbers[ array_numbers.length - 1 ]! + diff_from_recursion;

    console.log( pad( array_numbers[ array_numbers.length - 2 ]!, 10 ) + "   " + pad(  array_numbers[ array_numbers.length - 1 ]!, 10)  + "  (" + pad(  diff_from_recursion , 10 ) + ") = " + pad(  new_number , 10 ) );

    return new_number
}


function calcArray( pArray: string[] ): void 
{
    let result_part_01: number = 0;

    let result_part_02: number = 0;

    for ( const cur_input_str of pArray ) 
    {
        if ( cur_input_str !== "" )
        {
            console.log( "\n\n------------------------------------------------------------\n");
            console.log( cur_input_str );

            let new_number_cur : number = calcDiffRowRec( cur_input_str );

            result_part_01 += new_number_cur;
        }
    }

    console.log( "" );
    console.log( "Result Part 1 = " + result_part_01 );
    console.log( "Result Part 2 = " + result_part_02 );
}


async function readFileLines(): Promise<string[]> 
{
    const filePath: string = "/home/ea234/typescript/advent_of_code_2023__day09_input.txt";

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

    array_test.push( "0 3 6 9 12 15" );
    array_test.push( "1 3 6 10 15 21" );
    array_test.push( "10 13 16 21 30 45" );

    return array_test;
}


function calcDiffRow( pInput : string ) : string 
{
    let str_result : string = "";

    let narray : number[] = getNumberArray( pInput );

    let check_result : number = 0;

    for ( let index_C = 0; index_C < ( narray.length - 1 ); index_C++ )
    {
        let diff_c = narray[ index_C + 1 ]! - narray[ index_C ]!;

        check_result += diff_c;

        str_result += " " + diff_c;
    }

    if ( check_result === 0 )
    {
        console.log( "---- 0 ----" );
    }

    return str_result;
}






console.log( "Day 09 - Mirage Maintenance" );


//calcArray( getTestArray() );

checkReaddatei();

