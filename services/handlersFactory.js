const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const ApiFeatures = require('../utils/apiFeature');

exports.deleteOne = (Model) => asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const data = await Model.findByIdAndDelete(id);

    if (!data) {
        return next(new ApiError(`No data for this id ${id}`, 404));
    }
    res.status(204).send();
});

exports.updateOne = (Model) => asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const data = await Model.findOneAndUpdate(
        { _id: id },
        req.body,
        { new: true }
    );

    if (!data) {
        // res.status(404).json({ msg: `No data for this id ${id}` });
        return next(new ApiError(`No data for this id ${id}`, 404))
    }
    res.status(200).json({ data: data });
});

exports.createOne = (Model) => asyncHandler(async (req, res) => {
    const data = await Model.create(req.body);
    res.status(201).json({ data: data });
});

exports.getOne = (Model, populationOpt) =>
    asyncHandler(async (req, res, next) => {
        const { id } = req.params;
        let query = Model.findById(id);
        if (populationOpt) {
            query = query.populate(populationOpt)
        }
        const data = await query

        if (!data) {
            // res.status(404).json({ msg: `No data for this id ${id}` });
            return next(new ApiError(`No data for this id ${id}`, 404))
        }
        res.status(200).json({ data: data });
    });

exports.getAll = (Model, modelName = '') => asyncHandler(async (req, res, next) => {
    let filteration = {}
    if (req.filterObj) {
        filteration = req.filterObj
    }
    // build query
    let apiFeatures = new ApiFeatures(Model.find(filteration), req.query)
        .filter().search(modelName).field().sort()
    // .where('price').equals(req.query.price)

    const countDocs = await apiFeatures.mongooseQuery.clone().countDocuments()

    apiFeatures = apiFeatures.pagination(countDocs)

    const { mongooseQuery, paginationResult } = apiFeatures

    // execute
    const data = await mongooseQuery
    res.status(200).json({ result: data.length, paginationResult, data: data })
})
