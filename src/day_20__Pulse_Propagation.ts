import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * https://adventofcode.com/2023/day/20
 * 
 * https://www.reddit.com/r/adventofcode/comments/18mmfxb/2023_day_20_solutions/
 * 
 * 
 */
const PULSE_HIGH  : number =  1;
const PULSE_LOW   : number =  0;
const PULSE_EMPTY : number = -1;

interface Item 
{
  name: string;

  value: number;
}

class Queue 
{ 
    private items : Item[] = [];

    public add( pName : string, pValue : number ) : void 
    {        
        this.items.push( { name: pName, value : pValue } ); 
    }

    public get() : Item | undefined 
    { 
        return this.items.shift(); 
    }

    public peek() : Item | undefined 
    { 
        return this.items[ 0 ]; 
    }

    public getLength() : number 
    { 
        return this.items.length; 
    }

    public isEmpty() : boolean 
    {
        return this.items.length === 0;
    } 
}


class ModuleBox
{
    module_type        : string;

    module_name        : string; 

    vector_consumer    : string[] = [];

    flip_flop_status   : boolean = false;

    conjunction_pulses : Record< string, number > = {};

    count_low_pulses   : number = 0;

    count_high_pulses  : number = 0;

    output_pulse       : number = PULSE_EMPTY;

    queue_pulses       : Queue = new Queue();

    constructor( pInput : string )
    {
        const arrow_pos = pInput.indexOf( "->" );

        if ( pInput.startsWith( "broadcaster" )  )
        {
            this.module_type = "b"; 

            this.module_name = "broadcaster";
        }
        else if ( [ "%" , "&" ].includes( pInput.charAt( 0 ) ) )
        {
            this.module_type = pInput.charAt( 0 ); 

            this.module_name = pInput.substring( 1, arrow_pos ).trim();
        }
        else
        {
            this.module_type = "U"; 

            this.module_name = pInput.substring( 0, arrow_pos ).trim();
        }

        let target_string = pInput.substring( arrow_pos + 2 ).trim();

        if ( target_string !== "" )
        {
            const consumer_modules = pInput.substring( arrow_pos + 2 ).trim().split( "," );

            for ( const str_m of consumer_modules )
            {
                this.vector_consumer.push( str_m.trim() );
            }
        }
    }

    public addConjunctionFrom( pModuleID : string ) : void 
    {
        this.conjunction_pulses[ pModuleID ] = PULSE_LOW;
    }

    public receivePulse( pFromModuleBox : string, pPulse : number, pKnzDebug : boolean = false ) : number
    {
        if ( pPulse !== PULSE_EMPTY )
        {
            this.queue_pulses.add( pFromModuleBox, pPulse )

            if ( pPulse === PULSE_HIGH ) { this.count_high_pulses++; }
            if ( pPulse === PULSE_LOW  ) { this.count_low_pulses++;  }
        }

        if ( pKnzDebug )
        {
            wl( "From " + pFromModuleBox + " " + pPulse + " " + ( pPulse === PULSE_HIGH ? "high" : "low" ) + " -> " + this.getModuleName() + " Pulse   Queue-Count " + this.getQueueCount() );
        }

        return this.getQueueCount();
    }

    public isLastPulseLow() : boolean
    {
        let item_q : Item | undefined = this.queue_pulses.peek();

        if ( item_q == undefined ) return false;

        return item_q.value === PULSE_LOW;
    } 

    public consumePulse( pKnzDebug : boolean = false ) : boolean
    {
        if ( this.queue_pulses.isEmpty() ) 
        {
            return false;
        }

        this.output_pulse = PULSE_EMPTY;

        let cur_item = this.queue_pulses.get();

        let cur_pulse       = cur_item?.value;
        let cur_from_module = cur_item?.name;

        if ( this.isFlipFlop() )
        {
            /*
             * flip flop - high pulse - do nothing
             */

            if ( cur_pulse === PULSE_LOW   ) 
            { 
                if ( this.flip_flop_status )
                {
                    /*
                     * If it was on, it sends a low pulse.
                     */

                    this.output_pulse = PULSE_LOW;
                }
                else
                {
                    /*
                     * If it was off, it sends a high pulse. 
                     */

                    this.output_pulse = PULSE_HIGH;
                }

                this.flip_flop_status = !this.flip_flop_status;
            }
        }
        else if ( this.isConjunction() )
        {
            /*
             * First update the status
             *
             * When a pulse is received, the conjunction module first updates its memory for that input.
             */
            this.conjunction_pulses[ cur_from_module! ] = cur_pulse!;

            /*
             * Check if all send a high pulse
             */

            let knz_all_high_pulses = true;

            for ( const [ module_name_from, value ] of Object.entries( this.conjunction_pulses ) as [string, number][] ) 
            {
                if ( pKnzDebug )
                {
                    wl( "Consume Pulse - Conjunction From " + module_name_from + " Pulse " + value + " " + ( value === PULSE_HIGH ? "high" : "low" ) + " "); 
                }

                if ( !( value === PULSE_HIGH ) )
                {
                  knz_all_high_pulses = false;
                }
            }

            if ( knz_all_high_pulses )
            {
                /*
                 * if it remembers high pulses for all inputs, it sends a low pulse;
                 */
                this.output_pulse = PULSE_LOW
            }
            else
            {
                /*
                 * if it remembers low pulses for all inputs, it sends a high pulse;
                 */
                this.output_pulse = PULSE_HIGH
            }
        }
        else if ( this.isBroadcaster() )
        {
            this.output_pulse = cur_pulse!;
        }

        return this.output_pulse != PULSE_EMPTY;
    }

    public getQueueCount() : number 
    {
        return this.queue_pulses.getLength();
    }

    public getOutputPulse() : number 
    {
        return this.output_pulse;
    }

    public getHighPulses() : number 
    {
        return this.count_high_pulses;
    }

    public getLowPulses() : number 
    {
        return this.count_low_pulses;
    }

    public isFlipFlop() : boolean
    {
        return this.module_type === "%";
    }

    public isConjunction() : boolean
    {
        return this.module_type === "&";
    }

    public isBroadcaster() : boolean
    {
        return this.module_type === "b";
    }

    public isOnlyReceiver() : boolean
    {
        return this.module_type === "U";
    }

    public isModuleName( pString : string ) : boolean
    {
        return this.module_name === pString;
    }

    public getModuleName() : string
    {
        return this.module_name;
    }

    public getModuleType() : string 
    {
        if ( this.module_type == "%" ) return "Flip-Flop  "
        if ( this.module_type == "&" ) return "Conjunction"
        if ( this.module_type == "b" ) return "Broadcaster"
        if ( this.module_type == "U" ) return "Receiver   "

        return "unknown";
    }

    public hasConsumer( pModuleID : string ) : boolean
    {
        return this.vector_consumer.includes( pModuleID );
    }

    public getVectorConsumer() : string[]
    {
        return this.vector_consumer;
    }

    public getConsumerLine() : string 
    {
        let str_result : string = "";

        for ( const str_m of this.vector_consumer )
        {
            str_result += str_m + ", ";
        }

        return str_result;
    }

    public toString() : string 
    {
        return this.getModuleType() + " " + this.module_name + " -> " + this.getConsumerLine() + "  LOW " + this.count_low_pulses + " HIGH " + this.count_high_pulses;
    }
}


function wl( pString : string )
{
    console.log( pString );
}


function calcArray( pArray: string[], pKnzDebug : boolean = true, pKnzDebugIteration : boolean = false ): void 
{
    /*
     * *******************************************************************************************************
     * Declaring a vector for the modules
     * *******************************************************************************************************
     */
    let vector_modules : ModuleBox[] = [];

    const getModuleInst = ( pModuleName : string ) : ModuleBox | null => { 

            for ( let v_inst of vector_modules )
            {
                if ( v_inst.isModuleName( pModuleName ) )
                {
                    return v_inst;
                }
            }

            return null;
    }

    /*
     * *******************************************************************************************************
     * Creating modules from input, saving all consumers in a vector
     * *******************************************************************************************************
     */

    let vektor_check_all_consumers : string[] = [];

    for ( const cur_input_str of pArray ) 
    {
        if ( cur_input_str.trim() !== "" )
        {
            let cur_module_inst : ModuleBox = new ModuleBox( cur_input_str );

            vector_modules.push( cur_module_inst );

            for ( let receiver_module_name of cur_module_inst.getVectorConsumer() )
            {
                vektor_check_all_consumers.push( receiver_module_name );
            }
        }
    }

    /*
     * *******************************************************************************************************
     * Creating only output modules (receiver modules)
     * *******************************************************************************************************
     */

    const unique_consumer_list = Array.from( new Set( vektor_check_all_consumers ) );

    for ( let receiver_module_name of unique_consumer_list )
    {
        let cur_module_inst = getModuleInst( receiver_module_name );

        if ( cur_module_inst == null )
        {
            wl( "ADD Receiver-Module " + receiver_module_name );

            vector_modules.push( new ModuleBox( receiver_module_name + " ->" ) );
        }
    }

    /*
     * *******************************************************************************************************
     * Adding from-id to every conjunction module
     * *******************************************************************************************************
     */

    for ( let cur_module_inst of vector_modules )
    {
        if ( cur_module_inst.isConjunction() )
        {
            for ( let module_inst_b of vector_modules )
            {
                if ( module_inst_b.hasConsumer( cur_module_inst.getModuleName() ) )
                {
                    cur_module_inst.addConjunctionFrom( module_inst_b.getModuleName() );
                }
            }
        }
    }

    /*
     * *******************************************************************************************************
     * Doing the pulses
     * *******************************************************************************************************
     */

    let iteration_nr : number = 0;

    let module_broadcaster = getModuleInst( "broadcaster" );

    let module_rx = getModuleInst( "rx" );

    while ( iteration_nr < 1000 )
    {
        module_broadcaster?.receivePulse( "button", PULSE_LOW );

        let queue_length    : number = 1;

        let iteration_count : number  = 0 ;

        while ( ( queue_length > 0 ) && ( iteration_count < 1_000_000_000 ))
        {
            queue_length = 0;

            for ( let cur_module_inst of vector_modules )
            {
                let knz_has_output_pulse = cur_module_inst.consumePulse();

                if ( knz_has_output_pulse )
                {
                    for ( let receiver_module_name of cur_module_inst.getVectorConsumer() )
                    {
                        let receiver_module_inst = getModuleInst( receiver_module_name );

                        queue_length += receiver_module_inst?.receivePulse( cur_module_inst.getModuleName(), cur_module_inst.getOutputPulse(), pKnzDebugIteration ) ?? 0;
                    }
                }

                if ( module_rx !== null )
                {
                    if ( module_rx.isLastPulseLow() ) 
                    {
                        wl( "last pulse low " + iteration_nr );
                    }

                }


                queue_length += cur_module_inst.getQueueCount();
            }

            iteration_count++;
        }

        iteration_nr++;
    }

    /*
     * *******************************************************************************************************
     * Counting high and low pulses and calculating result for part 1
     * *******************************************************************************************************
     */
       
    let result_part_02 : number = 0;

    let count_low_pulses  : number = 0;
    let count_high_pulses : number = 0;

    for ( let cur_module_inst of vector_modules )
    {
        count_high_pulses += cur_module_inst.getHighPulses();
        count_low_pulses  += cur_module_inst.getLowPulses();
    }

    let count_pulse_total : number = count_high_pulses + count_low_pulses;
    
    let result_part_01    : number = count_high_pulses * count_low_pulses;

    if ( pKnzDebug )
    {
        wl( "--------------------------------------------------------------------------" );
        wl( "" );
        wl( "End-Values" );
        wl( "" );
        
        for ( let v_inst of vector_modules )
        {
            wl( "Module " + v_inst.toString() );
        }

        wl( "" );
    }

    wl( "count_high_pulses =>" + count_high_pulses + "<" );
    wl( "count_low_pulses  =>" + count_low_pulses + "<" );
    wl( "count_pulse_total =>" + count_pulse_total + "<" );
    wl( "" );
    wl( "" );
    wl( "Result Part 1 = " + result_part_01 );
    wl( "Result Part 2 = " + result_part_02 );
}


async function readFileLines(): Promise<string[]> 
{
    const filePath: string = "/home/ea234/typescript/advent_of_code_2023__day20_input.txt";

    const lines: string[] = [];

    const fileStream = await fs.open( filePath, 'r' ).then( handle => handle.createReadStream() );

    const rl = readline.createInterface( { input: fileStream, crlfDelay: Infinity } );

    for await ( const line of rl ) 
    {
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

        calcArray( arrFromFile, false, false );
    } )();
}


function getTestArray1(): string[] 
{
    const array_test: string[] = [];

    array_test.push( "broadcaster -> a, b, c" );
    array_test.push( "%a -> b" );
    array_test.push( "%b -> c" );
    array_test.push( "%c -> inv" );
    array_test.push( "&inv -> a" );
  
    return array_test;
}

function getTestArray2(): string[] 
{
    const array_test: string[] = [];

    array_test.push( "broadcaster -> a" );
    array_test.push( "%a -> inv, con" );
    array_test.push( "&inv -> b" );
    array_test.push( "%b -> con" );
    array_test.push( "&con -> output" );
  
    return array_test;
}


wl( "Day 20 - Pulse Propagation" );

//calcArray( getTestArray1(), true, true );

//calcArray( getTestArray2(), true, false );

checkReaddatei();

wl( "Day 20 - Ende" );
