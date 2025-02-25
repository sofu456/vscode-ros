// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import * as vscode from "vscode";

import * as extension from "../extension";
import * as common from "./common";

/**
 * Provides catkin tools build and test tasks.
 */
export class CatkinToolsProvider implements vscode.TaskProvider {
    public provideTasks(token?: vscode.CancellationToken): vscode.ProviderResult<vscode.Task[]> {
        let buildCommand: string;
        let testCommand: string;

        buildCommand = `catkin build --workspace "${extension.baseDir}"`;
        testCommand = `${buildCommand} --catkin-make-args run_tests`;

        const make = new vscode.Task({ type: "catkin" }, "make", "catkin");
        make.execution = new vscode.ShellExecution(buildCommand, {
            env: extension.env,
        });
        make.group = vscode.TaskGroup.Build;
        make.problemMatchers = ["$catkin-gcc"];

        const test = new vscode.Task({ type: "catkin", target: "run_tests" }, "run_tests", "catkin");
        test.execution = new vscode.ShellExecution(testCommand, {
            env: extension.env,
        });
        test.group = vscode.TaskGroup.Test;

        return [make, test];
    }

    public resolveTask(task: vscode.Task, token?: vscode.CancellationToken): vscode.ProviderResult<vscode.Task> {
        return undefined;
    }
}

/**
 * Interacts with the user to run a `catkin create pkg` command.
 */
export async function createPackage(uri?: vscode.Uri) {
    const createPkgCommand = (dependencies: string, name: string): string => {
        return `catkin create pkg --catkin-deps ${dependencies} -- ${name}`;
    };
    return common._createPackage(createPkgCommand);
}
