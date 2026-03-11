import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 *
 * 
 * Day 02 - Cube Conundrum 
 *  +    1   Game 1 ---  3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green Sum Colors Red 5  Blue 9  Green 4 
 *  +    2   Game 2 ---  1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue Sum Colors Red 1  Blue 6  Green 6 
 *       3   Game 3 ---  8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red Sum Colors Red 25  Blue 11  Green 26 
 *       4   Game 4 ---  1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red Sum Colors Red 23  Blue 21  Green 7 
 *  +    5   Game 5 ---  6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green Sum Colors Red 7  Blue 3  Green 5 
 */
type HashMapColorCount = Record<string, number>;

function sumColors( pStrCubeColors: string | undefined ): HashMapColorCount {

    const regex = /(\d+)\s+([a-zA-Z]+)\b/g;

    const hash_map_color_count: HashMapColorCount = {};

    hash_map_color_count[ "red" ] = 0;
    hash_map_color_count[ "blue" ] = 0;
    hash_map_color_count[ "green" ] = 0;

    if ( pStrCubeColors ) {

        let regex_matcher: RegExpExecArray | null;

        while ( ( regex_matcher = regex.exec( pStrCubeColors ) ) !== null ) {

            if ( regex_matcher[ 1 ] === undefined ) continue;
            if ( regex_matcher[ 2 ] === undefined ) continue;

            const value = parseInt( regex_matcher[ 1 ], 10 );

            const color = regex_matcher[ 2 ].toLowerCase();

            hash_map_color_count[ color ] = ( hash_map_color_count[ color ] ?? 0 ) + value;
        }
    }

    return hash_map_color_count;
}



function checkColors( pStrCubeColors: string | undefined ): boolean {

    const regex = /(\d+)\s+([a-zA-Z]+)\b/g;

    const hash_map_color_count: HashMapColorCount = {};

    hash_map_color_count[ "red" ] = 12;
    hash_map_color_count[ "green" ] = 13;
    hash_map_color_count[ "blue" ] = 14;

    if ( pStrCubeColors ) {

        let regex_matcher: RegExpExecArray | null;

        while ( ( regex_matcher = regex.exec( pStrCubeColors ) ) !== null ) {

            if ( regex_matcher[ 1 ] === undefined ) continue;
            if ( regex_matcher[ 2 ] === undefined ) continue;

            const value = parseInt( regex_matcher[ 1 ], 10 );

            const color = regex_matcher[ 2 ].toLowerCase();

            if ( value > ( hash_map_color_count[ color ] ?? 0 ) ) return false;
        }
    }

    return true;
}





function checkPossible( pHashMap: HashMapColorCount ): boolean {

    if ( pHashMap === undefined ) return false;

    const red = pHashMap[ "red" ];
    const blue = pHashMap[ "blue" ];
    const green = pHashMap[ "green" ];

    if ( red === undefined || blue === undefined || green === undefined ) return false; // falls keys fehlen

    if ( red > 12 ) return false;
    if ( blue > 13 ) return false;
    if ( green > 14 ) return false;

    return true;
}

function calcArray( pArray: string[] ): void {

    let result_part_01: number = 0;

    let result_part_02: number = 0;

    for ( const cur_input_str of pArray ) {

        const [ str_game, str_cube_colors ] = cur_input_str.split( ":" );

        const match = cur_input_str.match( /Game\s+(\d+):/ );

        const game_nr: number = match ? Number( match[ 1 ] ) : 0;

        //let hash_map_color_count = sumColors( str_cube_colors );

        let knz_possible = checkColors( str_cube_colors );

        if ( knz_possible ) {
            result_part_01 += game_nr;
        }

        //console.log( ( knz_possible ? " +  " : "    " ) + "  " + game_nr + "   " + str_game + " --- " + str_cube_colors + " Sum Colors Red " + hash_map_color_count[ "red" ] + "  Blue " + hash_map_color_count[ "blue" ] + "  Green " + hash_map_color_count[ "green" ] + " " );
        console.log( ( knz_possible ? " +  " : "    " ) + "  " + game_nr + "   " + str_game + " --- " + str_cube_colors  );
    }

    console.log( "Result Part 1 = " + result_part_01 );
    console.log( "Result Part 2 = " + result_part_02 );
}

function getTestArray(): string[] {
    const array_test: string[] = [];

    array_test.push( "Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green" );
    array_test.push( "Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue" );
    array_test.push( "Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red" );
    array_test.push( "Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red" );
    array_test.push( "Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green" );

    return array_test;
}



async function readFileLines(): Promise<string[]> {

    const filePath: string = "/home/ea234/typescript/advent_of_code_2023__day02_input.txt";

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

console.log( "Day 02 - Cube Conundrum" );


checkReaddatei();

//calcArray( getTestArray() );

