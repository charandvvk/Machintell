const generateId = (name, char) => {
    if (name.length >= 2) {
        const firstTwoChars = name.substring(0, 2).toUpperCase();
        const date = new Date();
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        const year = date.getFullYear().toString().slice(-2);
        const specialChars = "!@#$%^&*()_[]{}|";
        const specialChar = specialChars.charAt(
            Math.floor(Math.random() * specialChars.length)
        );
        const orderNumbers = "0123456789";
        const orderNumber = specialChars.charAt(
            Math.floor(Math.random() * orderNumbers.length)
        );
        return char + firstTwoChars + month + year + specialChar + orderNumber;
    }
};

export default generateId;
