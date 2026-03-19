import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * https://adventofcode.com/2023/day/13
 * 
 *      012345678
 *   0  #.##..##.
 *   1  ..#.##.#.
 *   2  ##......#
 *   3  ##......#
 *   4  ..#.##.#.
 *   5  ..##..##.
 *   6  #.#.##.#.
 * 
 * Row    0 180
 * Row    1 180
 * Row    2 90
 * Row    3 90
 * Row    4 180
 * Row    5 180
 * Row    6 180
 * 
 * Col    0 110
 * Col    1 50
 * Col    2 160
 * Col    3 50
 * Col    4 110
 * Col    5 110
 * Col    6 50
 * Col    7 160
 * Col    8 50
 * 
 * 
 * Row
 * 180,180,90,90,180,180,180
 * 0,90,0,-90,0,0,180
 * 
 * Col
 * 110,50,160,50,110,110,50,160,50
 * 60,-110,110,-60,0,60,-110,110,50
 * 
 * ------- 0  1   = max 0  1
 * ------- 2  3   = max 2  3
 * ------- 4  1   = max 2  3
 * ------- 5  1   = max 2  3
 * ------- 4  4   = max 4  4
 *  Ergebnis  4  4
 * 
 * 
 * result_x = 5
 * 
 * 
 *      012345678
 *   0  #...##..#
 *   1  #....#..#
 *   2  ..##..###
 *   3  #####.##.
 *   4  #####.##.
 *   5  ..##..###
 *   6  #....#..#
 * 
 * Row    0 170
 * Row    1 130
 * Row    2 260
 * Row    3 230
 * Row    4 230
 * Row    5 260
 * Row    6 130
 * 
 * Col    0 140
 * Col    1 70
 * Col    2 140
 * Col    3 140
 * Col    4 70
 * Col    5 70
 * Col    6 140
 * Col    7 140
 * Col    8 140
 * 
 * 
 * Row
 * 170,130,260,230,230,260,130
 * 40,-130,30,0,-30,130,130
 * 
 * Col
 * 140,70,140,140,70,70,140,140,140
 * 70,-70,0,70,0,-70,0,0,140
 * 
 * ------- 3  3   = max 3  3
 * ------- 2  2   = max 3  3
 * ------- 4  3   = max 4  3
 * ------- 6  1   = max 4  3
 * ------- 7  1   = max 4  3
 *  Ergebnis  3  3
 * 
 * 
 * result_x = 400
 */

type PropertieMap = Record< string, string >;

const CHAR_MAP_MIRROR : string = "#";
const CHAR_MAP_LAVA   : string = ".";
const CHAR_NOT_MAP    : string = "X";

const STR_COMBINE_SPACER                 : string = "   "; 

let file_string   : string = "";
let file_nr       : number = 0;
let file_write_on : boolean = false;

function wl( pString : string )
{
    console.log( pString );

    if ( file_write_on )
    {
        file_string +="\n" + pString;
    }
}


function writeFile( pFileName: string, pFileData: string ): void 
{
    if ( file_write_on )
    {
        fs.writeFile( pFileName, pFileData, { flag: "w" } );

        console.log( "File " + pFileName + " created!" );
    }
}


function pad( pInput : string | number, pPadLeft : number ) : string 
{
    let str_result : string = pInput.toString();

    while ( str_result.length < pPadLeft )
    { 
        str_result = " " + str_result;
    }

    return str_result;
}


function getDebugMap( pHashMap : PropertieMap, pMaxRows : number, pMaxCols : number  ): string 
{
    let str_result : string = "";

    str_result += pad( " ", 3 ) + "  ";

    for ( let cur_col = 0; cur_col < pMaxCols; cur_col++ )
    {
        str_result += cur_col % 10;
    }

    str_result += "\n";

    for ( let cur_row = 0; cur_row < pMaxRows; cur_row++ )
    {
        str_result += pad( cur_row, 3 ) + "  ";

        for ( let cur_col = 0; cur_col < pMaxCols; cur_col++ )
        {
            str_result += pHashMap[ "R" + cur_row  + "C" + cur_col ] ?? CHAR_NOT_MAP;
        }

        str_result += "\n";
    }

    return str_result;
}


function createMapX( pHashMap : PropertieMap, pMaxRows : number, pMaxCols : number  ): string 
{
    let str_result : string = "";

    str_result += "\nfunction getTestArray" + file_nr + "(): string[] ";
    str_result += "\n{";
    str_result += "\n    const array_test: string[] = [];";
    str_result += "\n";

    for ( let cur_row = 0; cur_row < pMaxRows; cur_row++ )
    {
        str_result += "\n    array_test.push( \"";

        for ( let cur_col = 0; cur_col < pMaxCols; cur_col++ )
        {
            str_result += pHashMap[ "R" + cur_row  + "C" + cur_col  ] ?? CHAR_NOT_MAP;
        }

        str_result += "\" );";
    }

    str_result += "\n  ";
    str_result += "\n    return array_test;";
    str_result += "\n}";
    str_result += "\n";

    return str_result;
}


function calcRowHash( pMap : PropertieMap, pMapCols : number, pRow1 : number ) : number 
{
    let hash_wert = 0;

    for ( let col_index = 0; col_index < pMapCols; col_index++ )
    {
        if ( ( pMap[ "R" + pRow1 + "C" + col_index ] ?? CHAR_NOT_MAP ) === CHAR_MAP_MIRROR )
        {
            hash_wert += ( col_index * 10 )
        }
        // else if ( ( pMap[ "R" + pRow1 + "C" + col_index ] ?? CHAR_NOT_MAP ) === CHAR_MAP_LAVA )
        // {
        //     hash_wert += ( col_index * 2 )
        // }
    }

    return hash_wert;
}


function calcColHash( pMap : PropertieMap, pMapRows : number, pCol : number ) : number 
{
    let hash_wert = 0;

    for ( let row_index = 0; row_index < pMapRows; row_index++ )
    {
        if ( ( pMap[ "R" + row_index + "C" + pCol ] ?? CHAR_NOT_MAP ) === CHAR_MAP_MIRROR )
        {
            hash_wert += ( row_index * 10 )
        }
        // else if ( ( pMap[ "R" + pRow1 + "C" + col_index ] ?? CHAR_NOT_MAP ) === CHAR_MAP_LAVA )
        // {
        //     hash_wert += ( col_index * 2 )
        // }
    }

    return hash_wert;
}


function getMirrorSteps( pVektor : number[], pStartIndex : number ): number
{
    let step_count : number = 0;

    let index_a = pStartIndex;
    let index_b = pStartIndex + 1;

    while ( ( index_a >= 0 ) && ( index_b < pVektor.length ) && ( pVektor[ index_a ] === pVektor[ index_b ]) )
    {
        index_a--;

        index_b++;

        step_count++;
    }

    return step_count;
}


function checkGrid( pMap : PropertieMap, pMapRows : number, pMapCols : number, pKnzDebug : boolean ) : number
{
    file_string = "";

    if ( pKnzDebug )
    {
        wl( getDebugMap(  pMap, pMapRows, pMapCols ) );
    }

    /*
     * *******************************************************************************************************
     * Calculating Hash-Values for Rows and Columns
     * *******************************************************************************************************
     */
    let hash_vektor_row : number[] = [];
    let hash_vektor_col : number[] = [];

    for ( let row_n : number = 0; row_n < pMapRows; row_n++ )
    {
        hash_vektor_row[ row_n ] = calcRowHash( pMap, pMapCols, row_n );

        if ( pKnzDebug )
        {
            wl( "Row " + pad( row_n, 4 ) + " " + hash_vektor_row[ row_n ] );
        }
    }

    if ( pKnzDebug )
    {
        wl( "" )
    }

    for ( let col_n : number = 0; col_n < pMapCols; col_n++ )
    {
        hash_vektor_col[ col_n ] = calcColHash( pMap, pMapCols, col_n );

        if ( pKnzDebug )
        {
            wl( "Col " + pad( col_n, 4 ) + " " + hash_vektor_col[ col_n ] );
        }
    }

    if ( pKnzDebug )
    {
        wl( "" )
    }

    /*
     * *******************************************************************************************************
     * Calculating difference Vektors for Rows and Columns
     * *******************************************************************************************************
     */
    let diff_row  : number[] = [ ...hash_vektor_row ];
    let diff_col  : number[] = [ ...hash_vektor_col ];

    for ( let index_b : number = 0; index_b < ( hash_vektor_row.length - 1 ); index_b++ )
    {
        diff_row[ index_b ] = hash_vektor_row[ index_b ]! - hash_vektor_row[ index_b + 1 ]!;
    }

    for ( let index_b : number = 0; index_b < ( hash_vektor_col.length - 1 ); index_b++ )
    {
        diff_col[ index_b ] = hash_vektor_col[ index_b ]! - hash_vektor_col[ index_b + 1 ]!;
    }

    if ( pKnzDebug )
    {
        wl( "" );
        wl( "Row" );
        wl( hash_vektor_row.toString() );
        wl( diff_row.toString() );
        wl( "" );
        wl( "Col" );
        wl( hash_vektor_col.toString() );
        wl( diff_col.toString() );
        wl( "" );
    }

    /*
     * *******************************************************************************************************
     * For every 0 difference, calculate the steps in the mirrord hash-values (Rows)
     * *******************************************************************************************************
     */
    let max_total_step_count    : number = 0;
    let max_total_start_index_0 : number = -1;
    let max_start_index_0       : number = -1;
    let max_step_count          : number = 0;
    let cur_step_count          : number = 0;

    for ( let index_b : number = 0; index_b < ( hash_vektor_row.length - 1 ); index_b++ )
    {
        if ( diff_row[ index_b ] === 0 ) 
        {
           cur_step_count = getMirrorSteps( hash_vektor_row, index_b );

            if ( cur_step_count > max_step_count )
            {
                max_step_count = cur_step_count;

                max_start_index_0 = index_b;
            }

            wl( "------- " + index_b + "  " + cur_step_count + "   = max " +  max_start_index_0  + "  " + max_step_count );            
        }
    }

    if ( max_step_count > max_total_step_count )
    {
        max_total_step_count = max_step_count;
        max_total_start_index_0 = max_start_index_0;
    }
    
    /*
     * *******************************************************************************************************
     * For every 0 difference, calculate the steps in the mirrord hash-values (Columns)
     * *******************************************************************************************************
     */
    for ( let index_b : number = 0; index_b < ( hash_vektor_col.length - 1 ); index_b++ )
    {
        if ( diff_col[ index_b ] === 0 ) 
        {
           cur_step_count = getMirrorSteps( hash_vektor_col, index_b );

            if ( cur_step_count >= max_step_count )
            {
                max_step_count = cur_step_count;

                max_start_index_0 = index_b;
            }

            wl( "------- " + index_b + "  " + cur_step_count + "   = max " +  max_start_index_0  + "  " + max_step_count );            
        }
    }

    /*
     * *******************************************************************************************************
     * Determine, wether the Map is mirrored horizontal or vertical
     * *******************************************************************************************************
     */
    let knz_mirror_col : boolean = false;

    if ( max_step_count > max_total_step_count )
    {
        max_total_step_count = max_step_count;
        max_total_start_index_0 = max_start_index_0;

        knz_mirror_col = true;
    }

    /*
     * *******************************************************************************************************
     * Calculating the Result-Value
     * *******************************************************************************************************
     */
    let result_x : number = 0;

    if ( max_total_step_count > 1 )
    {
        wl( " Ergebnis  " + max_total_start_index_0  + "  " + max_total_step_count );
        wl( "" );

        if ( knz_mirror_col )
        {
            result_x = max_total_start_index_0 + 1;
        }
        else
        {
            result_x = ( max_total_start_index_0 + 1 ) * 100;
        }
    }

    if ( pKnzDebug )
    {
        file_nr++;

        wl( "" );
        wl( "result_x = " + result_x );
        wl( "" );
        wl( createMapX( pMap, pMapRows, pMapCols ) );
        wl( "" );
        wl( "" );

        writeFile( "/home/ea234/typescript/temp_day13/testfall_" + file_nr + ".txt", file_string );
    }

    file_string = "";

    return result_x;
}


function calcArray( pArray: string[], pKnzDebug : boolean = true ): void 
{
    let map_input : PropertieMap = {};

    let result_part_01 : number = 0;
    let result_part_02 : number = 0;

    let grid_rows : number = 0;
    let grid_cols : number = 0;

    for ( const cur_input_str of pArray ) 
    {
        if ( cur_input_str == "")
        {
            result_part_01 += checkGrid( map_input, grid_rows, grid_cols, pKnzDebug );

            map_input = {};
            grid_cols = 0;
            grid_rows = 0;
        }
        else
        {
            for ( let cur_col1 = 0; cur_col1 < cur_input_str.length; cur_col1++ ) 
            {
                grid_cols = cur_col1;

                let cur_char_input : string = cur_input_str[ grid_cols ] ?? ".";

                let hash_map_key = "R" + grid_rows + "C" + grid_cols;

                map_input[ hash_map_key ] = cur_char_input;
            }

            grid_cols++;
            grid_rows++;
        }
    }

    if ( grid_rows > 0 )
    {
        result_part_01 += checkGrid( map_input, grid_rows, grid_cols, pKnzDebug );
    }

    wl( "" );
    wl( "Result Part 1 = " + result_part_01 );
    wl( "Result Part 2 = " + result_part_02 );
}


async function readFileLines(): Promise<string[]> 
{
    const filePath: string = "/home/ea234/typescript/advent_of_code_2023__day13_input.txt";

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

        calcArray( arrFromFile, false );
    } )();
}


function getTestArray1(): string[] 
{
    const array_test: string[] = [];

    array_test.push( "#.##..##." );
    array_test.push( "..#.##.#." );
    array_test.push( "##......#" );
    array_test.push( "##......#" );
    array_test.push( "..#.##.#." );
    array_test.push( "..##..##." );
    array_test.push( "#.#.##.#." );

    array_test.push( "" );

    array_test.push( "#...##..#" );
    array_test.push( "#....#..#" );
    array_test.push( "..##..###" );
    array_test.push( "#####.##." );
    array_test.push( "#####.##." );
    array_test.push( "..##..###" );
    array_test.push( "#....#..#" );

    return array_test;
}


function getTestArray2(): string[] 
{
    const array_test: string[] = [];

    array_test.push( "###############" );
    array_test.push( ".....#.####.#.." ); 
    array_test.push( ".....#.####.#.." ); 
    array_test.push( "##############." );
    array_test.push( "#############.." );
    array_test.push( "#####.##.####.." );
    //
    array_test.push( "######.###.#..#" ); 
    array_test.push( ".....#.####.#.." ); 
    array_test.push( ".....#.####.#.." ); 
    array_test.push( "######.###.##.#" ); 
    array_test.push( ".###..#.#....##" ); 
    // 
    array_test.push( ".###..#.#....##" );
    array_test.push( "######.###.##.#" );
    array_test.push( ".....#.####.#.." );
    array_test.push( ".....#.####.#.." );
    array_test.push( "######.###.#..#" );
    //
    array_test.push( "############..." );
    array_test.push( "###########...." );

    return array_test;
}


wl( "Day 13 - Point of Incidence" );

calcArray( getTestArray1());

/*
1111 = tl
35159 = to hi
28244 = to hi
*/

checkReaddatei();
 