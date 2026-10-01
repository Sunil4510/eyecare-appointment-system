/**
 * This file is provided you as part of the interview kit.
 * Feel free to modify it as needed.
 * Do not remove this comment.
 */

import * as path from "path";
import * as fs from "fs";


/**
 * This default utility function is provided to read data primarily from 
 * the seed data files. If an updated data file exists in the app_data
 * folder, it will read from there instead.
 */
export function getFileData(fileName: string) {
    const updatedFilePath = path.join(__dirname, `../app_data/app_data_${fileName}.json`);
    const seedFilePath = path.join(__dirname, `../seed_data/seed_data_${fileName}.json`);
    const filePath = fs.existsSync(updatedFilePath) ? updatedFilePath : seedFilePath;
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

import * as crypto from "crypto";

export function hashPassword(password: string): string {
    return crypto.createHash("sha256").update(password).digest("hex");
}

export function generateUUID(): string {
    return crypto.randomUUID();
}

/**
 * This default utility function appends new data to the specified file.
 * If the file does not exist in the app_data folder, it will create it
 * and initialize it with data from the seed data file before appending.
 */
export function addNewDataToFile<T>(fileName: string, newData: T): void {
    const appDataDir = path.join(__dirname, "../app_data");
    if (!fs.existsSync(appDataDir)) {
        fs.mkdirSync(appDataDir, { recursive: true });
    }
    const filePath = path.join(appDataDir, `app_data_${fileName}.json`);
    const seedFilePath = path.join(__dirname, `../seed_data/seed_data_${fileName}.json`);

    let data = [];
    if (fs.existsSync(filePath)) {
        // Read existing data from the file
        data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    } else if (fs.existsSync(seedFilePath)) {
        // If the file doesn't exist, load from the seed file
        data = JSON.parse(fs.readFileSync(seedFilePath, "utf-8"));
    }

    // Append the new data to the array
    data.push(newData);

    // Write the updated data back to the file
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

/**
 * This default utility function retrieves an entity by its ID from the specified file.
 * If the entity is not found, it returns undefined.
 */
export const getEntityById = <T extends { id: string }>(entity: string, id: string): T | undefined => {
    const data = getFileData(entity) as T[];
    return data.find(item => item.id === id);
};

/*************** You may add more utility functions ***************/


