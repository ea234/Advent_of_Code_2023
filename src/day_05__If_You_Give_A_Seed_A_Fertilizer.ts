import { promises as fs } from 'fs';
import { pid } from 'process';
import * as readline from 'readline';

/*
 * --- Day 5: If You Give A Seed A Fertilizer ---
 * https://adventofcode.com/2023/day/5
 * 
 * https://www.reddit.com/r/adventofcode/comments/18b4b0r/2023_day_5_solutions/
 * 
 * https://github.com/ea234/Advent_of_Code_2023/blob/main/src/day_05__If_You_Give_A_Seed_A_Fertilizer.ts
 * 
 * 
 * /home/ea234/.nvm/versions/node/v20.16.0/bin/node ./dist/day05/day_05__If_You_Give_A_Seed_A_Fertilizer.js
 * Day 05 - If You Give A Seed A Fertilizer
 * 
 * RangeVektor map_seed_to_soil
 * L 2 Source 98 To 99 => Destination 50
 * L 48 Source 50 To 97 => Destination 52
 * 
 * RangeVektor map_soil_to_fertilizer
 * L 37 Source 15 To 51 => Destination 0
 * L 2 Source 52 To 53 => Destination 37
 * L 15 Source 0 To 14 => Destination 39
 * 
 * RangeVektor map_fertilizer_to_water
 * L 8 Source 53 To 60 => Destination 49
 * L 42 Source 11 To 52 => Destination 0
 * L 7 Source 0 To 6 => Destination 42
 * L 4 Source 7 To 10 => Destination 57
 * 
 * RangeVektor map_water_to_light
 * L 7 Source 18 To 24 => Destination 88
 * L 70 Source 25 To 94 => Destination 18
 * 
 * RangeVektor map_light_to_temperature
 * L 23 Source 77 To 99 => Destination 45
 * L 19 Source 45 To 63 => Destination 81
 * L 13 Source 64 To 76 => Destination 68
 * 
 * RangeVektor map_temperature_to_humidity
 * L 1 Source 69 To 69 => Destination 0
 * L 69 Source 0 To 68 => Destination 1
 * 
 * RangeVektor map_humidity_to_location
 * L 37 Source 56 To 92 => Destination 60
 * L 4 Source 93 To 96 => Destination 56
 * 
 * seed_nr                 14
 * soil_nr                 14
 * fertilizer_nr           53
 * water_nr                49
 * light_nr                42
 * temperature_nr          42
 * humidity_nr             43
 * humidity_to_location_nr 43
 * 
 * seed_string 79 14 55 13
 * Seed 79 = Location 82
 * Seed 14 = Location 43
 * Seed 55 = Location 86
 * Seed 13 = Location 35
 * 
 * Result Part 1 = 35
 * Result Part 2 = 0
 * 
 * 
 * -----------------------------------------------------------------
 * seed_string 79 14 55 13
 * Seed 79 = Location 82
 * Seed 14 = Location 43
 * Seed 55 = Location 86
 * Seed 13 = Location 35
 * Seed 79 = 14 = 93
 *  - Seed 79 = Location 82    uniqcounter 1
 *  - Seed 82 = Location 46    uniqcounter 4
 * Seed 55 = 13 = 68
 * -----
 *  xcounter    27
 *  uniqcounter 27
 * 
 * Result Part 1 = 35
 * Result Part 2 = 46
 * 
 * seed_string 515785082 87905039 2104518691 503149843 720333403 385234193 ...
 * Seed 515785082 = Location 4202284817
 * Seed 87905039 = Location 2462188886
 * Seed 2104518691 = Location 4287508490
 * Seed 503149843 = Location 4050220846
 * Seed 720333403 = Location 2625685932
 * Seed 385234193 = Location 3507348822
 * Seed 1357904101 = Location 4074800133
 * Seed 283386167 = Location 892121398
 * Seed 93533455 = Location 2467817302
 * Seed 128569683 = Location 1104301931
 * Seed 2844655470 = Location 3337138858
 * Seed 24994629 = Location 1860608055
 * Seed 3934515023 = Location 2980390369
 * Seed 67327818 = Location 2441611665
 * Seed 2655687716 = Location 2734303452
 * Seed 8403417 = Location 457535844
 * Seed 3120497449 = Location 599623118
 * Seed 107756881 = Location 1083489129
 * Seed 4055128129 = Location 2353465194
 * Seed 9498708 = Location 458631135
 * Seed 515785082 = 87905039 = 603690121
 *  - Seed 515785082 = Location 4202284817    uniqcounter 1
 *  - Seed 517848290 = Location 490136624    uniqcounter 2063209
 * 
 * 
 */
type PropertieSeedX = Record<number, number>;

class RangeContainer 
{
    range_destination_start : number;
    range_source_start      : number;
    range_source_end        : number;
    range_length            : number;

    constructor( range_destination_start: number, range_source_start: number, range_length: number ) 
    {
        this.range_destination_start = range_destination_start;

        this.range_source_start = range_source_start;

        this.range_length = range_length;

        this.range_source_end = this.range_source_start + this.range_length - 1;
    }

    public getValue( pKeyNr : number ): number 
    {
        if ( pKeyNr < this.range_source_start ) return pKeyNr;

        if ( pKeyNr > this.range_source_end ) return pKeyNr;

        let relative_pos : number = pKeyNr - this.range_source_start;

        let nr_destination : number = this.range_destination_start + relative_pos;

        return nr_destination;
    }

    public toString() : string
    {
        return "L " + this.range_length + " Source " + this.range_source_start + " To " + this.range_source_end + " => Destination " + this.range_destination_start;
    }
}

class RangeVektor
{
    range_vektor : RangeContainer[] = [];

    range_name : string;

    constructor( range_name : string )
    {
        this.range_name = range_name;
    }

    public addRangeContainer( pRangeContainer : RangeContainer )
    {
        this.range_vektor.push( pRangeContainer );
    }

    public addRange( pInput : string )
    {
        let input_numbers: number[] = pInput.trim().split( /\s+/ ).map( Number );;

        let range_destination_start = input_numbers[0] ?? 0;

        let range_source_start = input_numbers[1] ?? 0;

        let range_length = input_numbers[2] ?? 0;

        this.range_vektor.push( new RangeContainer( range_destination_start, range_source_start, range_length ) );
    }

    public getValue(pKeyNr : number): number 
    {
        for ( let cur_range_container of this.range_vektor)
        {
            let result_number : number = cur_range_container.getValue( pKeyNr );

            if ( result_number != pKeyNr )
            {
                return result_number;
            }
        }

        return pKeyNr;
   }

    public toString(): string  
    {
        let str_result = "RangeVektor " + this.range_name + "\n";

        for ( let kk of this.range_vektor)
        {
            str_result += kk.toString() + "\n";
        }

        return str_result;
   }
}


function getNumberArray( pString: string ): number[] 
{
    return pString.trim().split( /\s+/ ).map( Number );
}


function addToRange( pMap : Map<number,number>, pInput: string ) : void 
{
    let input_numbers: number[] = getNumberArray( pInput );

    let range_destination_start = input_numbers[0] ?? 0;

    let range_source_start = input_numbers[1] ?? 0;

    let range_length = input_numbers[2] ?? 0;

    for ( let nr_cur = 0; nr_cur < range_length; nr_cur++)
    {
        let nr_destination = range_destination_start + nr_cur;
        let nr_source = range_source_start + nr_cur;

        pMap.set(nr_source, nr_destination);
    }
}


function testCalcRange( pInput : string ) : void 
{
    let map_range : Map<number,number> = new Map<number, number>();

    addToRange( map_range, pInput);

    addToRange( map_range, "52 50 48" );

    console.log( "\n----------\n");
    console.log( "testCalcRange( " + pInput + ")" );
    console.log( "" );
    console.log( "map_range.size " + map_range.size );
    console.log( "" );
    
    for (const [key, value] of map_range) 
    {
      console.log( " " + key + " " + value );
    }

    console.log( "" );

    let element_nr : number = 10;
    let val_de : number = map_range.get( element_nr ) ?? element_nr ;

    console.log( "Test Element 10 " + (map_range.get( element_nr ) ?? element_nr )  );
    console.log( "Test Element 10 " + val_de );
}



function calcArray( pArray: string[] ): void 
{
    let result_part_01: number = 0;

    let result_part_02: number = 0;

    /*
     * *******************************************************************************************************
     * Parsing Input
     * *******************************************************************************************************
     */

    let map_seed_to_soil            : RangeVektor = new RangeVektor( "map_seed_to_soil "            );
    let map_soil_to_fertilizer      : RangeVektor = new RangeVektor( "map_soil_to_fertilizer "      );
    let map_fertilizer_to_water     : RangeVektor = new RangeVektor( "map_fertilizer_to_water "     );
    let map_water_to_light          : RangeVektor = new RangeVektor( "map_water_to_light "          );
    let map_light_to_temperature    : RangeVektor = new RangeVektor( "map_light_to_temperature "    );
    let map_temperature_to_humidity : RangeVektor = new RangeVektor( "map_temperature_to_humidity " );
    let map_humidity_to_location    : RangeVektor = new RangeVektor( "map_humidity_to_location "    );

    let map_current : RangeVektor | undefined;

    let seed_string : string = "";

    for ( const cur_input_str of pArray ) 
    {
        if ( cur_input_str === "" ) 
        {
            map_current = undefined;
        }
        else if ( cur_input_str === "seed-to-soil map:" )
        {
            map_current = map_seed_to_soil;
        }
        else if ( cur_input_str === "soil-to-fertilizer map:" )
        {
            map_current = map_soil_to_fertilizer;
        }
        else if ( cur_input_str === "fertilizer-to-water map:" )
        {
            map_current = map_fertilizer_to_water;
        }
        else if ( cur_input_str === "water-to-light map:" )
        {
            map_current = map_water_to_light;
        }
        else if ( cur_input_str === "light-to-temperature map:" )
        {
            map_current = map_light_to_temperature;
        }
        else if ( cur_input_str === "temperature-to-humidity map:" )
        {
            map_current = map_temperature_to_humidity;
        }
        else if ( cur_input_str === "humidity-to-location map:" )
        {
            map_current = map_humidity_to_location;
        }
        else if ( cur_input_str === "humidity-to-location map:" )
        {
            map_current = map_humidity_to_location;
        }
        else if ( cur_input_str.startsWith("seeds:")  )
        {
            seed_string = cur_input_str.substring( 7 );
        }
        else
        {
            if ( map_current )
            {
                map_current.addRange( cur_input_str );
            }
        }
    }

    let knz_debug : boolean = true;

    if ( knz_debug )
    {
        console.log( map_seed_to_soil.toString()            );
        console.log( map_soil_to_fertilizer.toString()      );
        console.log( map_fertilizer_to_water.toString()     );
        console.log( map_water_to_light.toString()          );
        console.log( map_light_to_temperature.toString()    );
        console.log( map_temperature_to_humidity.toString() );
        console.log( map_humidity_to_location.toString()    );

        let seed_nr        : number = 82;
        let soil_nr        : number = map_seed_to_soil.getValue( seed_nr );
        let fertilizer_nr  : number = map_soil_to_fertilizer.getValue( soil_nr );
        let water_nr       : number = map_fertilizer_to_water.getValue( fertilizer_nr );
        let light_nr       : number = map_water_to_light.getValue( water_nr );
        let temperature_nr : number = map_light_to_temperature.getValue( light_nr );
        let humidity_nr    : number = map_temperature_to_humidity.getValue( temperature_nr );
        let location_nr    : number = map_humidity_to_location.getValue( humidity_nr );

        console.log( "seed_nr                 " + seed_nr        );
        console.log( "soil_nr                 " + soil_nr        );
        console.log( "fertilizer_nr           " + fertilizer_nr  );
        console.log( "water_nr                " + water_nr       );
        console.log( "light_nr                " + light_nr       );
        console.log( "temperature_nr          " + temperature_nr );
        console.log( "humidity_nr             " + humidity_nr    );
        console.log( "humidity_to_location_nr " + location_nr    );
        console.log( "" );
        console.log( "seed_string " + seed_string );
    }

     /*
      * *******************************************************************************************************
      * Calculating Part 1 
      * *******************************************************************************************************
      */

    result_part_01 = Number.MAX_VALUE;

    let seed_numbers: number[] = getNumberArray( seed_string );

    for ( const seed_nr of seed_numbers )
    {
        let soil_nr        : number = map_seed_to_soil.getValue( seed_nr );
        let fertilizer_nr  : number = map_soil_to_fertilizer.getValue( soil_nr );
        let water_nr       : number = map_fertilizer_to_water.getValue( fertilizer_nr );
        let light_nr       : number = map_water_to_light.getValue( water_nr );
        let temperature_nr : number = map_light_to_temperature.getValue( light_nr );
        let humidity_nr    : number = map_temperature_to_humidity.getValue( temperature_nr );
        let location_nr    : number = map_humidity_to_location.getValue( humidity_nr );

        console.log( "Seed " + seed_nr + " = Location " + location_nr );

        if ( location_nr < result_part_01)
        {
            result_part_01 = location_nr;
        }
    }

     /*
      * *******************************************************************************************************
      * Calculating Part 2
      * *******************************************************************************************************
      */

    result_part_02 = Number.MAX_VALUE;

    let save_loc : PropertieSeedX = {};

    let xcounter : number = 0;
    let uniqcounter : number = 0;

    for ( let i : number = 0; i < seed_numbers.length; i += 2 )
    {
        let cur_start : number = seed_numbers[ i ]!;

        let cur_end : number = cur_start + seed_numbers[ i + 1 ]!;

        console.log( "Seed " + cur_start + " = " + seed_numbers[ i + 1 ]! + " = " + cur_end );

        for ( let cur_seed_nr = cur_start; cur_seed_nr < cur_end; cur_seed_nr++ )
        {
            if ( !( cur_seed_nr in save_loc ) ) 
            {
                let soil_nr        : number = map_seed_to_soil.getValue( cur_seed_nr );
                let fertilizer_nr  : number = map_soil_to_fertilizer.getValue( soil_nr );
                let water_nr       : number = map_fertilizer_to_water.getValue( fertilizer_nr );
                let light_nr       : number = map_water_to_light.getValue( water_nr );
                let temperature_nr : number = map_light_to_temperature.getValue( light_nr );
                let humidity_nr    : number = map_temperature_to_humidity.getValue( temperature_nr );
                let location_nr    : number = map_humidity_to_location.getValue( humidity_nr );

                save_loc[ cur_seed_nr ] = location_nr;

                uniqcounter++;

                if ( location_nr < result_part_02 )
                {
                    console.log( " - Seed " + cur_seed_nr + " = Location " + location_nr + "    uniqcounter " + uniqcounter );

                    result_part_02 = location_nr;
                }
            }

            xcounter++;

            if ( xcounter > 100_000_000 )
            {
                break;
            }
        }

        if ( xcounter > 100_000_000 )
        {
            break;
        }

    }



    console.log( "-----" );
    console.log( " xcounter    " + xcounter )
    console.log( " uniqcounter " + uniqcounter )
    console.log( "" );
    console.log( "Result Part 1 = " + result_part_01 );
    console.log( "Result Part 2 = " + result_part_02 );
}


async function readFileLines(): Promise<string[]> 
{
    const filePath: string = "/home/ea234/typescript/advent_of_code_2023__day05_input.txt";

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

    array_test.push( "seeds: 79 14 55 13" );
    array_test.push( "" );
    array_test.push( "seed-to-soil map:" );
    array_test.push( "50 98 2" );
    array_test.push( "52 50 48" );
    array_test.push( "" );
    array_test.push( "soil-to-fertilizer map:" );
    array_test.push( "0 15 37" );
    array_test.push( "37 52 2" );
    array_test.push( "39 0 15" );
    array_test.push( "" );
    array_test.push( "fertilizer-to-water map:" );
    array_test.push( "49 53 8" );
    array_test.push( "0 11 42" );
    array_test.push( "42 0 7" );
    array_test.push( "57 7 4" );
    array_test.push( "" );
    array_test.push( "water-to-light map:" );
    array_test.push( "88 18 7" );
    array_test.push( "18 25 70" );
    array_test.push( "" );
    array_test.push( "light-to-temperature map:" );
    array_test.push( "45 77 23" );
    array_test.push( "81 45 19" );
    array_test.push( "68 64 13" );
    array_test.push( "" );
    array_test.push( "temperature-to-humidity map:" );
    array_test.push( "0 69 1" );
    array_test.push( "1 0 69" );
    array_test.push( "" );
    array_test.push( "humidity-to-location map:" );
    array_test.push( "60 56 37" );
    array_test.push( "56 93 4" );
    array_test.push( "" );

    return array_test;
}


console.log( "Day 05 - If You Give A Seed A Fertilizer" );

//testCalcRange( "50 98 2"  );
//testCalcRange(  "52 50 48"  );

calcArray( getTestArray() );

//checkReaddatei();




