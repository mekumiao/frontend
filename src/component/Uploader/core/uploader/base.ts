// 所有 Uploader 的基类
import { Task } from "../types";
import UploadManager from "../index";
import Logger from "../logger";
import { validate } from "../utils/validator";

export enum Status {
    added,
    preparing,
    queued,
    processing,
    finishing,
    finished,
    error,
    stopped,
}

export interface UploadHandlers {
    onTransition: (newStatus: Status) => void;
    onError: (err: Error) => void;
    onProgress: () => void;
}

export default abstract class Base {
    public child?: Base[];
    public status: Status = Status.added;

    public id = ++Base.id;
    private static id = 0;

    protected logger: Logger;

    protected subscriber: UploadHandlers;

    constructor(public task: Task, protected manager: UploadManager) {
        this.logger = new Logger(
            this.manager.logger.level,
            "UPLOADER",
            this.id
        );
        this.logger.info("Initialize new uploader for task: ", task);

        this.subscriber = {
            /* eslint-disable @typescript-eslint/no-empty-function */
            onTransition: (newStatus: Status) => {},
            onError: (err: Error) => {},
            onProgress: () => {},
            /* eslint-enable @typescript-eslint/no-empty-function */
        };
    }

    public subscribe = (handlers: UploadHandlers) => {
        this.subscriber = handlers;
    };

    public start = async () => {
        this.logger.info("Activate uploading task.");
        try {
            validate(this.task.file, this.task.policy);
        } catch (e) {
            this.setError(e);
            return;
        }

        this.status = Status.preparing;
        this.subscriber.onTransition(this.status);
    };

    protected setError(e: Error) {
        this.status = Status.error;
        this.subscriber.onError(e);
    }
}