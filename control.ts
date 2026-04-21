
/**
 * Control namespace functionality in blocks
 */
//%block="Control"
//% groups=["Device control", "Debugging", "Device & session information"]
namespace blockControl {

    //% block="assert $condition or exit with code $code"
    //% blockId="blockControl_assert"
    //% code.defl=20
    //% group="Device control"
    //% weight=100
    export function assert(condition: boolean, code: number): void {
        control.assert(condition, code);
    }

    /**
     * Announce event that happened to registered handlers.
     * @param src Micro:Bit component ID. Visit hyperlink for more information
     * (https://github.com/microsoft/pxt-microbit/blob/master/libs/core/dal.d.ts)
     * @param value Component specific code
     */
    //% block="raise event $src with value $value"
    //% blockId="blockControl_raise_event"
    //% src.defl=1
    //% group="Device control"
    //% weight=90
    export function raiseEvent(src: number, value: number): void {
        control.raiseEvent(src, value);
    }

    /**
     * Run code on registered event
     * @param src Micro:Bit component ID. Visit hyperlink for more information
     * (https://github.com/microsoft/pxt-microbit/blob/master/libs/core/dal.d.ts)
     * @param value Component specific code
     * @param flags Flags to enable
     */
    //% block="run code on event with id $src, code $value ||, flags $flags"
    //% blockId="blockControl_on_event"
    //% src.defl=1
    //% group="Device control"
    //% weight=80
    export function onEvent(src: number, value: number, handler: () => void, flags?: number): void {
        control.onEvent(src, value, handler, flags);
    }

    /**
     * Block calling thread until event is run
     * @param src Micro:Bit component ID. Visit hyperlink for more information
     * (https://github.com/microsoft/pxt-microbit/blob/master/libs/core/dal.d.ts)
     * @param value Component specific code
     */
    //% block="wait for event with id $src, code $value"
    //% blockId="blockControl_wait_for_event"
    //% src.defl=1
    //% group="Device control"
    //% weight=70
    export function waitForEvent(src: number, value: number): void {
        control.waitForEvent(src, value);
    }

    /**
     * Run code in parallel
     */
    //% block="run code in parallel"
    //% blockId="blockControl_run_in_parallel"
    //% group="Device control"
    //% weight=60
    export function runInParallel(handler: () => void): void {
        control.runInParallel(handler);
    }

    /**
     * Deprecated; Use control.runInParallel
     * Run code in the background
     */
    //% block="run code in the background"
    //% blockId="blockControl_run_in_background"
    //% group="Device control"
    //% weight=50
    //% deprecated=true
    export function runInBackground(handler: () => void): void {
        control.runInBackground(handler);
    }

    /**
     * Create a new zero-initiated buffer
     * @param size Number of bytes in the buffer
     * @returns A Buffer object
     */
    //% block="create buffer of size $size"
    //% blockId="blockControl_create_buffer"
    //% size.defl=1024
    //% group="Device control"
    //% weight=40
    export function createBuffer(size: number): Buffer {
        return control.createBuffer(size);
    }

    /**
     * Create a new buffer from UTF8-encoded string
     * @param str UTF8 string
     * @returns A Buffer object
     */
    //% block="create buffer from $str"
    //% blockId="blockControl_create_buffer_UTF8"
    //$ str.defl="string"
    //% group="Device control"
    //% weight=40
    export function createBufferFromUTF8(str: string): Buffer {
        return control.createBufferFromUTF8(str);
    }



    /**
     * Dump internal information about a value
     * @param value Value to dump
     */
    //% block="dump internal information about $value"
    //% blockId="blockControl_dmesg_value"
    //% group="Debugging"
    //% weight=100
    export function dmesgValue(value: any): void {
        control.dmesgValue(value);
    }

    /**
     * Force garbage collection and dump
     * basic information about heap
     */
    //% block="force GC and dump heap info"
    //% blockId="blockControl_gc"
    //% group="Debugging"
    //% weight=90
    export function gc(): void {
        control.gc();
    }

    /**
     * Force garbage collection and wait
     * for debugger to fully dump heap
     */
    //% block="force GC and fully dump heap"
    //% blockId="blockControl_heap_dump"
    //% group="Debugging"
    //% weight=80
    export function heapDump(): void {
        control.heapDump();
    }

    /**
     * Set flags when connecting an external debugger
     * @param flags Flags to set
     */
    //% block="set debugger flags $flags"
    //% blockId="blockControl_set_debug_flags"
    //% group="Debugging"
    //% weight=70
    export function setDebugFlags(flags: number): void {
        control.setDebugFlags(flags);
    }

    /**
     * Record a heap snapshot for debugging
     * memory leaks
     */
    //% block="record a heap snapshot"
    //% blockId="blockControl_heap_snapshot"
    //% group="Debugging"
    //% weight=60
    export function heapSnapshot(): void {
        control.heapSnapshot();
    }

    /**
     * Run function and log runtime to console (μs)
     * @param func Function to execute
     */
    //% block="benchmark runtime"
    //% blockId="blockControl_benchmark"
    //% group="Debugging"
    //% weight=50
    export function benchmark(func: () => void): void {
        let runtime = control.benchmark(func);
        console.log(runtime);
    }

    // Conversion from ms to microseconds
    export enum TimeFormat {
        Milliseconds = 1,
        Microseconds = 1000
    }

    /**
     * Return time since device started (ms / μs)
     * @returns Time since device started in milliseconds or microseconds
     */
    //% block="time since device started in $format"
    //% blockId="blockControl_time_since_start"
    //% group="Device & session information"
    //% weight=100
    export function timeSinceStart(format: TimeFormat): number {
        return control.millis() * format;
    }

    /**
     * Derives a unique and consistent serial number from internal data
     * @returns Serial number of the device
     */
    //% block="device serial number"
    //% blockId="blockControl_device_serial_number"
    //% group="Device & session information"
    //% weight=90
    export function deviceSerialNumber(): number {
        return control.deviceSerialNumber();
    }

    /**
     * Derives a unique and consistent 64-bit serial number from internal data
     * @returns Serial number of the device
     */
    //% block="long device serial number"
    //% blockId="blockControl_device_long_serial_number"
    //% group="Device & session information"
    //% weight=80
    export function deviceLongSerialNumber(): Buffer {
        return control.deviceLongSerialNumber();
    }

    /**
     * Determine current system software version ('sim' for simulator)
     * @retuns A device version string
     */
    //% block="system software version"
    //% blockId="blockControl_device_dal_version"
    //% group="Device & session information"
    //% weight=70
    export function deviceDalVersion(): string {
        return control.deviceDalVersion();
    }

    /**
     * Check if profiling is enabled in current build
     * @retuns Boolean, true if profiling is enabled
     */
    //% block="is profiling enabled"
    //% blockId="blockControl_device_profiling enabled"
    //% group="Device & session information"
    //% weight=60
    export function profilingEnabled(): boolean {
        return control.profilingEnabled();
    }

    /**
     * Get the current program hash
     * @returns Hash of the program running
     */
    //% block="current program hash"
    //% blockId="blockControl_program_hash"
    //% group="Device & session information"
    //% weight=50
    export function programHash(): number {
        return control.programHash();
    }

    /**
     * Get the current program name
     * @returns Name of the program running
     */
    //% block="current program name"
    //% blockId="blockControl_program_name"
    //% group="Device & session information"
    //% weight=40
    export function programName(): string {
        return control.programName();
    }

    /**
     * Get the estimated ram size (B)
     * Simulator is restricted to 32M
     * @returns Ram size in bytes
     */
    //% block="device ram size"
    //% blockId="blockControl_ram_size"
    //% group="Device & session information"
    //% weight=30
    export function ramSize(): number {
        return control.ramSize();
    }

    /**
     * Check if game is running in simulator
     * Equivalent to checking `deviceDalVersion == 'sim'`
     * @returns True if running in simulator
     */
    //% block="running in simulator"
    //% blockId="blockControl_in_simulator"
    //% group="Device & session information"
    //% weight=20
    export function inSimulator(): boolean {
        return control.deviceDalVersion() == "sim";
    }
}