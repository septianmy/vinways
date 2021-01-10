var multer = require('multer'); 

exports.uploadImage = (field1,field2) => {
	var storage = multer.diskStorage({
		destination: function(req, file, cb) {
			cb(null, `uploads/${file.fieldname}`);
		},
		filename: function(req, file, cb) {
			cb(null, Date.now() + '-' + file.originalname);
		}
	});

	const imageFilter = function(req, file, cb) {
		if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
			req.fileValidationError = {
				message: 'Only image files are allowed!'
			};
			return cb(new Error('Only image files are allowed!'), false);
		}
		cb(null, true);
	};

	const maxSize = 2 * 1000 * 1000;

	const upload = multer({
		storage,
		fileFilter: imageFilter,
		limits: {
			fileSize: maxSize
		}
	}).fields([
		{
			name : field1,
		},
		{
			name: field2,
		},
	]);

	return (req, res, next) => {
		upload(req, res, function(err) {
			if (req.fileValidationError)
				return res.status(401).send(req.fileValidationError);
			if (err) {
				if (err.code === 'LIMIT_FILE_SIZE') {
					return res.status(403).send({
						message: 'Max file sized 2MB'
					});
				}
				return res.status(404).send(err);
			}
			return next();
		});
	};
};