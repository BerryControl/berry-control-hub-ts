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

import { NextFunction, Request, Response } from 'express'
import asyncHandler from 'express-async-handler'

import { DriverDescriptorType } from '../driver-descriptor-type'
import { readDeviceDriverDescriptorsEndpoint } from 'transport-model'
import { EndpointDescription } from './endpoint-description'

export const readDeviceDriverDescriptorsEndpointDescriptor = new EndpointDescription(
  readDeviceDriverDescriptorsEndpoint.method,
  readDeviceDriverDescriptorsEndpoint.uri,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const drivers: Set<DriverDescriptorType> = await globalThis.pluginManager.loadPlugins()
    const result = Array.from(drivers).map((driver: DriverDescriptorType) => {
      return {
        pluginId: driver.pluginId,
        displayName: driver.displayName,
        description: driver.description,
        authenticationMethod: driver.authenticationMethod,
        needsAuthentication: driver.needsAuthentication
      }
    })

    res.type('application/json')
    res.send(JSON.stringify(result))
  })
)