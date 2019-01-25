interface option {
    width: number;
    height: number;
}
export declare function getLocalVideo(option?: Partial<option>): Promise<MediaStream>;
export declare function getLocalAudio(): Promise<MediaStream>;
export {};
