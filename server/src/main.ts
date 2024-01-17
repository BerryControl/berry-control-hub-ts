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

import express from 'express'
import path from 'path'

import { PluginManager } from 'berry-plugin-manager'

import { DriverDescriptorType } from './driver-descriptor-type'
import { logger } from './logger'
import * as endpoint from './endpoints'

const UI_PATH = '../../ui/build'
const app = express()

declare global {
    var pluginManager: PluginManager<DriverDescriptorType>
}

globalThis.pluginManager = new PluginManager<DriverDescriptorType>({
    pluginPackageNamePattern: /^(berrycontrol-driver-[\w-]*)$/
})


// serve REST API
app.get(
    endpoint.readDeviceDriverDescriptorsEndpointDescriptor.path,
    endpoint.readDeviceDriverDescriptorsEndpointDescriptor.handler)
// serve UI
app.use(express.static(path.normalize(path.join(__dirname, UI_PATH))))


// start server
app.listen(3000, () => {
    logger.log('info', 'The application is listening on port 3000!')
})
