/*
 *    Copyright [2015] [wisemapping]
 *
 *   Licensed under WiseMapping Public License, Version 1.0 (the "License").
 *   It is basically the Apache License, Version 2.0 (the "License") plus the
 *   "powered by wisemapping" text requirement on every single page;
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the license at
 *
 *       http://www.wisemapping.org/license
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 */
import { $assert, $defined } from '@wisemapping/core-js';
import ModelCodeName from './ModelCodeName';
import XMLSerializer from './XMLSerializer_Pela';

class Beta2PelaMigrator {
  constructor(betaSerializer) {
    this._betaSerializer = betaSerializer;
    this._pelaSerializer = new XMLSerializer();
  }

  toXML(mindmap) {
    return this._pelaSerializer.toXML(mindmap);
  }

  loadFromDom(dom, mapId) {
    $assert($defined(mapId), 'mapId can not be null');
    const mindmap = this._betaSerializer.loadFromDom(dom, mapId);
    mindmap.setVersion(ModelCodeName.PELA);

    // Beta does not set position on second level nodes ...
    const branches = mindmap.getBranches();
    const me = this;
    branches.forEach((model) => {
      me._fixPosition(model);
    });

    return mindmap;
  }

  _fixPosition(parentModel) {
    const parentPos = parentModel.getPosition();
    const isRight = parentPos.x > 0;
    const me = this;
    parentModel.getChildren().forEach((child) => {
      if (!child.getPosition()) {
        child.setPosition(parentPos.x + (50 * isRight ? 1 : -1), parentPos.y);
      }
      me._fixPosition(child);
    });
  }
}

export default Beta2PelaMigrator;
