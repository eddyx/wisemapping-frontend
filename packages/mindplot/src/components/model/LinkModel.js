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
import { $assert } from '@wisemapping/core-js';
import FeatureModel from './FeatureModel';

class LinkModel extends FeatureModel {
  constructor(attributes) {
    super(LinkModel.FEATURE_TYPE);
    this.setUrl(attributes.url);
  }

  /** @return {String} the url attribute value */
  getUrl() {
    return this.getAttribute('url');
  }

  /**
     * @param {String} url a URL provided by the user to set the link to
     * @throws will throw an error if url is null or undefined
     */
  setUrl(url) {
    $assert(url, 'url can not be null');

    const fixedUrl = LinkModel._fixUrl(url);
    this.setAttribute('url', fixedUrl);

    const type = fixedUrl.includes('mailto:') ? 'mail' : 'url';
    this.setAttribute('urlType', type);
  }

  // url format is already checked in LinkEditor.checkUrl
  static _fixUrl(url) {
    let result = url;
    if (!result.includes('http://') && !result.includes('https://') && !result.includes('mailto://')) {
      result = `http://${result}`;
    }
    return result;
  }

  /**
     * @param {String} urlType the url type, either 'mail' or 'url'
     * @throws will throw an error if urlType is null or undefined
     */
  setUrlType(urlType) {
    $assert(urlType, 'urlType can not be null');
    this.setAttribute('urlType', urlType);
  }
}

/**
 * @constant
 * @type {String}
 * @default
 */
LinkModel.FEATURE_TYPE = 'link';

export default LinkModel;
