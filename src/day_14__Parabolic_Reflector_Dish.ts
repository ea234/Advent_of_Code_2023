import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * https://adventofcode.com/2023/day/14
 * 
 * 
 * ------------------------------------------------------------------
 * 
 */

type PropertieMap = Record< string, string >;

class Rock 
{
    m_art : number = 1;

    m_row : number = 0;
    m_col : number = 0;

    constructor( pArt : string, pRow : number, pCol : number )
    {
        this.m_art = pArt === CHAR_MAP_CUBED_ROCK ? 1 : 0;

        this.m_row = pRow;

        this.m_col = pCol;
    }

    public getRow() : number 
    {
        return this.m_row;
    }

    public setRow( pRow: number ) : void
    {
        this.m_row = pRow;
    }

    public getCol() : number 
    {
        return this.m_col;
    }

    public setCol( pCol : number ) : void 
    {
        this.m_col = pCol;
    }

    public isRow( pRow : number ) : boolean 
    {
        return this.m_row === pRow;
    }

    public isCol( pCol : number  ) : boolean
    {
        return this.m_col === pCol;
    }

    public getChar() : string 
    {
        return ( this.m_art === 1 ? CHAR_MAP_CUBED_ROCK : CHAR_MAP_ROUNDED_ROCK );
    }

    public getKey() : string 
    {
        return "R" + this.m_row + "C" + this.m_col;
    }

    public isCubed() : boolean
    {
        return this.m_art === 1;
    }

    public isRound() : boolean
    {
        return this.m_art === 0;
    }

    public toString() : string 
    {
        return ( this.m_art === 1 ? "cubed" : "round" ) + " Rock " + pad( this.m_row, 4 ) + " Col " + this.m_col;
    }
}

const CHAR_MAP_ROUNDED_ROCK: string = "O";
const CHAR_MAP_CUBED_ROCK  : string = "#";
const CHAR_MAP_SPACE       : string = ".";
const CHAR_NOT_MAP         : string = "X";

let file_string   : string = "";
let file_nr       : number = 0;
let file_write_on : boolean = false;

let KNZ_DEBUG : boolean = false;

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


function getDebugMap( rock_vektor : Rock[], pMaxRows : number, pMaxCols : number  ): string 
{
    let pHashMap : PropertieMap = {};

    for ( const rock_inst of rock_vektor )
    {
        pHashMap[ rock_inst.getKey() ] = rock_inst.getChar();
    }

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
            str_result += pHashMap[ "R" + cur_row  + "C" + cur_col ] ?? CHAR_MAP_SPACE;
        }

        str_result += "\n";
    }

    return str_result;
}


function toNorth( rock_vektor : Rock[], grid_rows : number, grid_cols : number )
{
    const free_row : number[] = new Array( grid_cols ).fill( -1 );

    rock_vektor.sort( (a, b) => a.getRow() - b.getRow());

    for ( const rock_inst of rock_vektor )
    {
        if ( rock_inst.isCubed() ) 
        {
            free_row[ rock_inst.getCol() ] = rock_inst.getRow();
        }
        else
        {
            free_row[ rock_inst.getCol() ]! += 1;

            rock_inst.setRow(  free_row[ rock_inst.getCol() ]! );
        }
    }
}

function toSouth( rock_vektor : Rock[], grid_rows : number, grid_cols : number )
{
    const free_row : number[] = new Array( grid_cols ).fill( grid_rows + 1 );

    rock_vektor.sort( (a, b) => b.getRow() - a.getRow());

    for ( const rock_inst of rock_vektor )
    {
        wl( "toSouth - " + rock_inst.toString() );

        if ( rock_inst.isCubed() ) 
        {
            free_row[ rock_inst.getCol() ] = rock_inst.getRow();
        }
        else
        {
            free_row[ rock_inst.getCol() ]! -= 1;

            rock_inst.setRow(  free_row[ rock_inst.getCol() ]! );
        }
    }
}


function calcArray( pArray: string[], pKnzDebug : boolean = true ): void 
{
    /*
     * *******************************************************************************************************
     * Initialising the grid
     * *******************************************************************************************************
     */

    let rock_vektor : Rock[] = [];

    let map_input : PropertieMap = {};

    let result_part_01 : number = 0;
    let result_part_02 : number = 0;

    let grid_rows : number = 0;
    let grid_cols : number = 0;

    for ( const cur_input_str of pArray ) 
    {
        if ( cur_input_str != "")
        {
            for ( let cur_col1 = 0; cur_col1 < cur_input_str.length; cur_col1++ ) 
            {
                grid_cols = cur_col1;

                let cur_char_input : string = cur_input_str[ grid_cols ] ?? ".";

                if ( cur_char_input != CHAR_MAP_SPACE )
                {
                    rock_vektor.push( new Rock(cur_char_input, grid_rows, grid_cols ) )
                }

                let hash_map_key = "R" + grid_rows + "C" + grid_cols;

                map_input[ hash_map_key ] = cur_char_input;
            }

            grid_cols++;
            grid_rows++;
        }
    }


    for ( const rock_inst of rock_vektor )
    {
        wl( rock_inst.toString() );
    }


    wl( "" );

    rock_vektor.sort( (a, b) => b.getRow() - a.getRow());

    for ( const rock_inst of rock_vektor )
    {
        wl( rock_inst.toString() );
    }


    /*
     * *******************************************************************************************************
     * Roll all to the north
     * *******************************************************************************************************
     */

    const start_date = new Date();

    let nr_togo = 0;

    toNorth(rock_vektor, grid_rows, grid_cols);
    wl( "" );
    wl( getDebugMap(rock_vektor, grid_rows, grid_cols) );

    toSouth( rock_vektor, grid_rows, grid_cols );

    wl( "" );
    wl( getDebugMap(rock_vektor, grid_rows, grid_cols) );


    /*
     * Test Part 2 the hard way ... not suitable
     */
    // for ( let iteration_nr = 0; iteration_nr < 1_000_000_000; iteration_nr++)
    // for ( let iteration_nr = 0; iteration_nr < 40_000; iteration_nr++)
    // {
    //     const now = new Date();
    //     console.log( "Iteration Nr " + iteration_nr + " " + now.toISOString() );
    //
    //     toNorth( map_input, grid_rows, grid_cols );
    //     toWest( map_input, grid_rows, grid_cols );
    //     toSouth( map_input, grid_rows, grid_cols );
    //     toEast( map_input, grid_rows, grid_cols );
    // }

    console.log( "start " + start_date.toISOString() );


    /*
     * *******************************************************************************************************
     * Calculating the Result-Value
     * *******************************************************************************************************
     */

    wl( "" );
    wl( "Result Part 1 = " + result_part_01 );
    wl( "Result Part 2 = " + result_part_02 );
}


async function readFileLines(): Promise<string[]> 
{
    const filePath: string = "/home/ea234/typescript/advent_of_code_2023__day14_input.txt";

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

        calcArray( arrFromFile, true );
    } )();
}


function getTestArray1(): string[] 
{
    const array_test: string[] = [];

    array_test.push( "O....#...." );
    array_test.push( "O.OO#....#" );
    array_test.push( ".....##..." );
    array_test.push( "OO.#O....O" );
    array_test.push( ".O.....O#." );
    array_test.push( "O.#..O.#.#" );
    array_test.push( "..O..#O..O" );
    array_test.push( ".......O.." );
    array_test.push( "#....###.." );
    array_test.push( "#OO..#...." );


    // array_test.push( "OOOO.#.O.." );
    // array_test.push( "OO..#....#" );
    // array_test.push( "OO..O##..O" );
    // array_test.push( "O..#.OO..." );
    // array_test.push( "........#." );
    // array_test.push( "..#....#.#" );
    // array_test.push( "..O..#.O.O" );
    // array_test.push( "..O......." );
    // array_test.push( "#....###.." );
    // array_test.push( "#....#...." );

    return array_test;
}



function getTestArray2(): string[] 
{
    const array_test: string[] = [];

    array_test.push( "....#...." );
    array_test.push( "......#.." );
    array_test.push( "OOOO#...." );
    array_test.push( "....#OOOO" );
    array_test.push( "........." );
    array_test.push( ".#......." );
    array_test.push( "........." );
    array_test.push( "....#...." );


    return array_test;
}



wl( "Day 14 - Parabolic Reflector Dish" );

calcArray( getTestArray2() );

/*
*/

//checkReaddatei();
 