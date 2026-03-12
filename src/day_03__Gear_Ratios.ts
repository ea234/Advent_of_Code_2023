import { promises as fs } from 'fs';
import * as readline from 'readline';

type PropertieMap = Record<string, string>;


function getDebugMap( pHashMap: PropertieMap, pRows: number, pCols: number ): string {

    let str_result: string = "";

    for ( let cur_row: number = 0; cur_row < pRows; cur_row++ ) {

        for ( let cur_col: number = 0; cur_col < pCols; cur_col++ ) 
        {
            str_result += pHashMap[ "R" + cur_row + "C" + cur_col ] ?? " ";
        }

        str_result += "\n";
    }

    return str_result;
}


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


function calcArray( pArray: string[] ): void {

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

    //let deb_map : string = getDebugMap( hash_map, grid_rows, grid_cols );

    //console.log( "" );
    //console.log( deb_map );

    console.log( "" );

    let cur_number: number = 0;
    let cur_number_ok: boolean = true;

    for ( let cur_row: number = 0; cur_row < grid_rows; cur_row++ ) {

        for ( let cur_col: number = 0; cur_col < grid_cols; cur_col++ ) {

            let cur_char = hash_map[ "R" + cur_row + "C" + cur_col ] ?? " ";

            /*
             * Check for Number
             */

            if ( cur_char >= '0' && cur_char <= '9' ) {
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
            else {

                if ( ( cur_number > 0 ) && ( cur_number_ok ) ) {

                    result_part_01 += cur_number;
                }

                cur_number = 0;
                cur_number_ok = false;
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

function checkReaddatei(): void {
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


