import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * https://adventofcode.com/2023/day/18
 * 
 * 
 * 
 */

const CHAR_MAP_DIGGER : string = "#";
const CHAR_MAP_FREE   : string = " ";
const CHAR_FLOOD_FILL : string = "A";

type PropertieMap = Record< string, string >;

type DigStep = {
  direction: string;
  steps: number;
  color: string; 
};


function parseInput( pInput: string ): DigStep | null 
{
    /*
     * Remove leading and trailing whitespace-character
     */
    const input_trimmed = pInput.trim();

    /*
     * RegEx for direction (U,R,D,L), Number, Color
     */
    const regex_dig_step = /^([URDL])\s+(\d+)\s*\(#([0-9a-fA-F]{3,8})\)$/;

    const regex_matcher = input_trimmed.match(regex_dig_step);

    if ( !regex_matcher ) 
    {
        return null;
    }

    const direction = regex_matcher[ 1 ] as 'U' | 'R' | 'D' | 'L';

    const steps = Number( regex_matcher[ 2 ] );

    const color = regex_matcher[3];

    if ( isNaN( steps ) ) return null;

    return { direction, steps, color: `#${color}` };
}

function parseHexCode( input: string ): DigStep 
{
    const input_trimmed = input.trim().startsWith("#") ? input.trim().slice(1) : input.trim();

    if ( !/^[0-9a-fA-F]{6}$/.test (input_trimmed ) )
    {
        throw new Error("Ungültiges Format: Erwartet 6 hex-Zeichen.");
    }

    const hex_steps = input_trimmed.slice( 0, 5 );

    const hex_direction = input_trimmed.charAt( 5 );

    const steps = parseInt( hex_steps, 16 );

    const direction_index : number = parseInt(hex_direction, 16);

    let direction : string;

    switch ( direction_index )
    {
        case 0: direction = "R"; break;
        case 1: direction = "D"; break;
        case 2: direction = "L"; break;
        case 3: direction = "U"; break;
        default : direction = "";     
    }

    return { direction, steps, color: "" };
}


function wl( pString : string )
{
    console.log( pString );
}


function writeFile( pFileName: string, pFileData: string ): void 
{
    fs.writeFile( pFileName, pFileData, { flag: "w" } );

    console.log( "File created!" );
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


function getDebugMap( pHashMap : PropertieMap, pMinRows : number, pMinCols : number, pMaxRows : number, pMaxCols : number  ): string 
{
    let str_result : string = "";

    str_result += pad( " ", 3 ) + "  ";

    for ( let cur_col = 0; cur_col < pMaxCols; cur_col++ )
    {
        str_result += cur_col % 10;
    }

    str_result += "\n";

    for ( let cur_row = pMinRows; cur_row < pMaxRows; cur_row++ )
    {
        str_result += pad( cur_row, 3 ) + "  ";

        for ( let cur_col = pMinCols; cur_col < pMaxCols; cur_col++ )
        {
            str_result += pHashMap[ "R" + cur_row  + "C" + cur_col ] ?? " ";
        }

        str_result += "\n";
    }

    return str_result;
}


function floodFillNonRecursive( pHashMap: PropertieMap, pMinRows: number, pMinCols: number, pMaxRows: number, pMaxCols: number, pStartRow: number, pStartCol: number ) : void 
{ 
    /*
     * Hilfs-Stack: Paare von Koordinaten 
     */
    const stack: Array<{ r: number; c: number }> = [];

    const getCell = ( pRow : number, pCol : number ) : string => { const key = "R" + pRow + "C" + pCol; return ( pHashMap[ key ] ?? CHAR_MAP_FREE ) as string; };

    const setCell = ( pRow : number, pCol : number, pValue : string): void => { const key = "R" + pRow + "C" + pCol; pHashMap[key] = pValue; };

    if ( pStartRow < pMinRows || pStartRow >= pMaxRows || pStartCol < pMinCols || pStartCol >= pMaxCols ) { return; }

    const startVal = getCell( pStartRow, pStartCol ); 

    if ( startVal === CHAR_FLOOD_FILL ) return; 
    if ( startVal === CHAR_MAP_DIGGER ) return;
    if ( startVal !== CHAR_MAP_FREE   ) return;

    let info_nr = 0;

    stack.push( { r: pStartRow, c: pStartCol } );

    while ( stack.length > 0 ) 
    {
        const { r: cur_row, c: cur_col } = stack.pop()!;

        info_nr++;

        if ( info_nr >= 100000 )
        {
            const now = new Date();

            wl( "R " + cur_row + " C " + cur_col + "  " + stack.length + " " + now.toISOString());

            info_nr = 0;
        }

        /*
         * Check Boundaries
         */
        if ( cur_row < pMinRows || cur_row >= pMaxRows || cur_col < pMinCols || cur_col >= pMaxCols ) continue;

        /*
        * Check current coords
        */
        const cur_cell_value = getCell( cur_row, cur_col );

        if ( cur_cell_value === CHAR_MAP_FREE )
        {
            setCell( cur_row, cur_col, CHAR_FLOOD_FILL );

            stack.push( { r: cur_row - 1, c: cur_col } ); // above
            stack.push( { r: cur_row + 1, c: cur_col } ); // below
            stack.push( { r: cur_row, c: cur_col - 1 } ); // left
            stack.push( { r: cur_row, c: cur_col + 1 } ); // right
        }
    } 
}


function countTiles( pHashMap : PropertieMap, pMinRows : number, pMinCols : number, pMaxRows : number, pMaxCols : number, pTile : string  ): number
{
    let count_tile : number = 0;

    for ( let cur_row = pMinRows; cur_row < pMaxRows; cur_row++ )
    {
        for ( let cur_col = pMinCols; cur_col < pMaxCols; cur_col++ )
        {
            if ( ( pHashMap[ "R" + cur_row  + "C" + cur_col  ] ?? CHAR_MAP_FREE ) == pTile )
            {
                  count_tile++;
            }
        }
    }

    return count_tile;
}


function calcArray( pArray: string[], pKnzDebug : boolean = true ): void 
{
    let map_input : PropertieMap = {};

    let dig_plan_part_1 : DigStep[] = [];
    let dig_plan_part_2 : DigStep[] = [];
            
    let result_part_01 : number = 0;
    let result_part_02 : number = 0;

    for ( const cur_input_str of pArray ) 
    {
        if ( cur_input_str != "")
        {   
            const dig_step_part_1 = parseInput( cur_input_str );

            if ( dig_step_part_1 )
            {
                dig_plan_part_1.push( dig_step_part_1 );

                const dig_step_part_2 = parseHexCode( dig_step_part_1.color );

                dig_plan_part_2.push( dig_step_part_2 )
            }

            console.log( dig_step_part_1 );
        }
    }

    wl( "" );

    let grid_min_row : number = 0;
    let grid_min_col : number = 0;

    let grid_max_rows : number = 0;
    let grid_max_cols : number = 0;
    
    let digger_row : number = 0; 
    let digger_col : number = 0;

    for ( const dig_step of dig_plan_part_1 )
    {
        wl( dig_step.direction + " " + pad( dig_step.steps, 5 ) );

        for ( let step_nr = 0; step_nr < dig_step.steps; step_nr++ )
        {
            map_input[ "R" + digger_row + "C" + digger_col ] = CHAR_MAP_DIGGER;

            if ( dig_step.direction == "R" )
            {
                digger_col++;
            }
            else if ( dig_step.direction == "L" )
            {
                digger_col--;
            }
            else if ( dig_step.direction == "D" )
            {
                digger_row++;
            }
            else if ( dig_step.direction == "U" )
            {
                digger_row--;
            }
        }

        if ( digger_row < grid_min_row )
        {
            grid_min_row = digger_row;
        }

        if ( digger_col < grid_min_col )
        {
            grid_min_col = digger_col;
        }


        if ( digger_row >= grid_max_rows )
        {
            grid_max_rows = digger_row;
        }

        if ( digger_col >= grid_max_cols )
        {
            grid_max_cols = digger_col;
        }
    }

    /*
     * Ensure there are extra rows and cols around the map
     * This is for flood fill
     */
    grid_min_col--;
    grid_min_row--;

    grid_max_rows++;
    grid_max_cols++;
    grid_max_rows++;
    grid_max_cols++;

    writeFile( "/home/ea234/typescript/debug_map_day18_a.txt", getDebugMap( map_input, grid_min_row, grid_min_col, grid_max_rows, grid_max_cols )  );

    floodFillNonRecursive( map_input, grid_min_row, grid_min_col, grid_max_rows, grid_max_cols, grid_min_row, grid_min_col );

    writeFile( "/home/ea234/typescript/debug_map_day18_b.txt", getDebugMap( map_input, grid_min_row, grid_min_col, grid_max_rows, grid_max_cols )  );

    result_part_01 = countTiles( map_input, grid_min_row, grid_min_col, grid_max_rows, grid_max_cols, CHAR_MAP_DIGGER );
    result_part_01 += countTiles( map_input, grid_min_row, grid_min_col, grid_max_rows, grid_max_cols, CHAR_MAP_FREE );

    /*
     * Part 2 
     * Colorinfos are encoded digging directions
     * Map grows huge.
     * Flood-Fill and debug-map-generation not possible.
     */
    let knz_do_part2 : boolean = false;

    if ( knz_do_part2 )
    {
        wl( "" );

        let grid_min_row_p2 : number = 0;
        let grid_min_col_p2 : number = 0;

        let grid_max_rows_p2 : number = 0;
        let grid_max_cols_p2 : number = 0;

        map_input = {};

        digger_row = 0; 
        digger_col = 0;

        for ( const dig_step of dig_plan_part_2 )
        {
            wl( dig_step.direction + " " + pad( dig_step.steps, 5 ) );

            for ( let step_nr = 0; step_nr < dig_step.steps; step_nr++ )
            {
                map_input[ "R" + digger_row + "C" + digger_col ] = CHAR_MAP_DIGGER;

                if ( dig_step.direction == "R" )
                {
                    digger_col++;
                }
                else if ( dig_step.direction == "L" )
                {
                    digger_col--;
                }
                else if ( dig_step.direction == "D" )
                {
                    digger_row++;
                }
                else if ( dig_step.direction == "U" )
                {
                    digger_row--;
                }
            }

            if ( digger_row < grid_min_row_p2 )
            {
                grid_min_row_p2 = digger_row;
            }

            if ( digger_col < grid_min_col_p2 )
            {
                grid_min_col_p2 = digger_col;
            }

            if ( digger_row >= grid_max_rows_p2 )
            {
                grid_max_rows_p2 = digger_row;
            }

            if ( digger_col >= grid_max_cols_p2 )
            {
                grid_max_cols_p2 = digger_col;
            }
        }

        grid_min_col_p2--;
        grid_min_row_p2--;
        
        grid_max_rows_p2++;
        grid_max_cols_p2++;
        grid_max_rows_p2++;
        grid_max_cols_p2++;

        wl( "min row " + grid_min_row_p2 + " max row " + grid_max_rows_p2 + "  width " + ( grid_max_rows_p2 - grid_min_row_p2) );
        wl( "min col " + grid_min_col_p2 + " max row " + grid_max_cols_p2 + "  width " + ( grid_max_cols_p2 - grid_min_col_p2) );

        //writeFile( "/home/ea234/typescript/debug_map_day18_2a.txt", getDebugMap( map_input, grid_min_row_p2, grid_min_col_p2, grid_max_rows_p2, grid_max_cols_p2 )  );
        //floodFillNonRecursive( map_input, grid_min_row_p2, grid_min_col_p2, grid_max_rows_p2, grid_max_cols_p2, grid_min_row_p2, grid_min_col_p2 );
        //writeFile( "/home/ea234/typescript/debug_map_day18_2b.txt", getDebugMap( map_input, grid_min_row_p2, grid_min_col_p2, grid_max_rows_p2, grid_max_cols_p2 )  );

        result_part_02 = countTiles( map_input, grid_min_row_p2, grid_min_col_p2, grid_max_rows_p2, grid_max_cols_p2, CHAR_MAP_DIGGER );
        result_part_02 += countTiles( map_input, grid_min_row_p2, grid_min_col_p2, grid_max_rows_p2, grid_max_cols_p2, CHAR_MAP_FREE );
    }

    wl( "" );
    wl( "Result Part 1 = " + result_part_01 );
    wl( "Result Part 2 = " + result_part_02 );
    wl( "Result Part 2 = " + ( result_part_01 + result_part_02 ) );
}


async function readFileLines(): Promise<string[]> 
{
    const filePath: string = "/home/ea234/typescript/advent_of_code_2023__day18_input.txt";

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

    array_test.push( "R 6 (#70c710)" );
    array_test.push( "D 5 (#0dc571)" );
    array_test.push( "L 2 (#5713f0)" );
    array_test.push( "D 2 (#d2c081)" );
    array_test.push( "R 2 (#59c680)" );
    array_test.push( "D 2 (#411b91)" );
    array_test.push( "L 5 (#8ceee2)" );
    array_test.push( "U 2 (#caa173)" );
    array_test.push( "L 1 (#1b58a2)" );
    array_test.push( "U 2 (#caa171)" );
    array_test.push( "R 2 (#7807d2)" );
    array_test.push( "U 3 (#a77fa3)" );
    array_test.push( "L 2 (#015232)" );
    array_test.push( "U 2 (#7a21e3)" );
  
    return array_test;
}


wl( "Day 18 - Lavaduct Lagoon" );


checkReaddatei();

//calcArray( getTestArray1() );
 /*
Klar, ich helfe dir gern. Du willst also eine Funktion, die aus einem Vektor von Polygon-Punkten den Flächeninhalt berechnet, basierend auf einer gedachten Karte von Zeilen/Spalten.

Wenn dein Polygon durch eine Folge von Eckpunkten definiert ist (in Reihenfolge), kannst du den Flächeninhalt mit der Shoelace-Formel (auch Gauss'sche Flächenformel) berechnen. Hier ist eine kompakte Beschreibung bzw. Pseudocode, den du in vielen Programmiersprachen verwenden kannst:

    Eingabe: eine Liste von Punkten [(x0,y0), (x1,y1), ..., (xn-1, yn-1)], wobei der letzte Punkt mit dem ersten verbunden ist.
    Fläche A = 0.5 * | sum_{i=0}^{n-1} (xi * y_{i+1} - x_{i+1} * yi) |, wobei x_n = x0 und y_n = y0.

Beispiel-Pseudocode (Python-ähnlich):

def polygon_area(points): n = len(points) area2 = 0.0 # Doppelte Fläche for i in range(n): x0, y0 = points[i] x1, y1 = points[(i + 1) % n] area2 += x0 * y1 - x1 * y0 return abs(area2) * 0.5

Wichtige Hinweise:

    Punkte sollten in entweder cw (im Uhrzeigersinn) oder ccw (gegen den Uhrzeigersinn) Reihenfolge vorliegen. Die Absolute macht die Richtung unwichtig.
    Falls der Polygon-Pfad über eine Rasterkarte (Zeilen/Spalten) geordnet ist, musst du die Koordinaten entsprechend zuordnen (z. B. Spalten = x, Zeilen = y). Falls du Rasterindexe statt Koordinaten verwendest, bleibt die Formel gültig, solange Abstände konsistent sind.
    Falls das Polygon selbst nur innerhalb einer Zelle liegt oder Rasterauflösung wichtig ist, musst du ggf. die Einheiten der Koordinaten beachten (z. B. Pixel/ Zellen).

Wenn du mir die Programmiersprache nennst, passe ich dir den Code exakt an.

 */