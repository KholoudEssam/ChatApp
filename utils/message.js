module.exports = (from, body) => {
    return {
        from,
        body,
        createdAt: new Date().getTime(),
    };
};
