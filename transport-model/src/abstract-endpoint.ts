/*
   Copyright 2024 Thomas Bonk

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
 */

export enum HttpMethod {
    GET = 'get',
    HEAD = 'head',
    POST = 'post',
    PUT = 'put',
    DELETE = 'delete',
    PATCH = 'patch'
}

export interface AbstractEndpointOptions {
    method: HttpMethod
    uri: string
}

export abstract class AbstractEndpoint {
    private _method: HttpMethod
    private _uri: string
    private _uriParameterNames?: Set<string>

    public get method(): HttpMethod {
        return this._method
    }

    public get uri(): string {
        return this._uri
    }

    public constructor(options: AbstractEndpointOptions) {
        this._method = options.method
        this._uri = options.uri

        this._retrieveUriParameters()
    }

    public getResolvedUri(parameters?: Map<string, string | number>): string {
        if (!parameters || !this._uriParameterNames) {
            return this.uri
        }

        if (!parameters && this._uriParameterNames) {
            throw `Endpoint '${this}' contains URI parameters, but none are provided.`
        }

        let resolvedUri = this.uri

        for (var name in parameters.keys()) {
            if (!this._uriParameterNames.has(name)) {
                throw `Endpoint '${this}' doesn't accept URI parameter '${name}'`
            }

            resolvedUri.replace(`:${name}`, parameters.get(name)!.toString())
        }

        return resolvedUri
    }

    private _retrieveUriParameters() {
        const regexp = /:([a-zA-Z])([a-zA-Z0-9])*/gm
        let match: RegExpExecArray | null

        do {
            match = regexp.exec(this.uri)

            if (match) {
                let parameterName = match[0].substring(1)

                if (!this._uriParameterNames) {
                    this._uriParameterNames = new Set()
                }

                this._uriParameterNames.add(parameterName)
            }
        } while (match)
    }
}