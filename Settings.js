/**
 * @author Rob van den Hout <vdhout@studyportals.eu>
 * @version 1.0.0
 * @copyright © 2018 StudyPortals B.V., all rights reserved.
 */

const Settings = {

	update: function(key, value){

		let url = new URL(location.href);
		url.searchParams.set(key, value);
		location.href = url.href;
	},
};