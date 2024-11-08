const express = require('express');
const connectToDB = require('./connect/connect'); 
const app = express();
const port = 8080;
const cors = require('cors');
const Catalog = require('./model/Catalog');
const Vehicle = require('./model/Vehicle');
const Cart = require('./model/Cart');
const User = require('./model/User');
const multer = require('multer');
const mongoose = require('mongoose');
const path = require('path');


app.use(cors()); 
app.use(express.json());
app.use('/uploads', express.static('uploads')); 
const startServer = async () => {
    await connectToDB(); 

app.use(express.json());  // Middleware để parse JSON trong request


// Kết nối MongoDB và chạy server
mongoose.connect('mongodb://localhost:27017/shop', { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    app.listen(8080, () => {
        console.log('Server đang chạy trên cổng 8080');
    });
})
.catch(err => console.log(err));

// API thêm sản phẩm vào giỏ hàng
app.post('/cart', async (req, res) => {
    const { userId, id_product, imgProduct, nameProduct, number, price } = req.body;
    try {
      const isCheckCart = await Cart.findOne({ id: userId });

      if (!isCheckCart) {
        // Tạo giỏ hàng mới nếu chưa có
        const newCart = new Cart({
          id: userId,
          details: [
            {
              id_product: id_product,  // id_product thay vì _id
              imgProduct: imgProduct,
              nameProduct: nameProduct,
              number: number,
              price: price,
            },
          ],
        });

        const savedCart = await newCart.save();
        return res.send(savedCart);
      } else {
        // Kiểm tra sản phẩm có trong giỏ hàng chưa
        const isCheckProduct = isCheckCart.details.find(item => item.id_product === id_product);

        if (!isCheckProduct) {
          isCheckCart.details.push({
            id_product: id_product,  // id_product thay vì _id
            imgProduct: imgProduct,
            nameProduct: nameProduct,
            number: number,
            price: price,
          });

          const updatedCart = await isCheckCart.save();
          return res.send(updatedCart);
        } else {
          return res.status(409).send(`Sản phẩm đã có trong giỏ hàng!`);
        }
      }
    } catch (error) {
      console.error('Lỗi khi xử lý:', error.message);
      res.status(500).send(`Lỗi: ${error.message}`);
    }
});
app.get('/cart', async (req, res) => {
    try {
      const id = req.params.id
      console.log(id)
      const listCart = await Cart.find(
        { id: id }
      );
  
      if (listCart.length === 0) {
        return res.status(404).send('Không tìm thấy giỏ hàng');
      } else {
        return res.status(200).json(listCart);
      }
    } catch (e) {
      // Ghi log lỗi để dễ dàng theo dõi
      console.error(e);
      return res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy giỏ hàng' });
    }
  });

////tạo api user
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ msg: 'Email already exists' });
    }

    try {
      const newUser = new User({ username, email, password });
      await newUser.save();
      res.status(201).json({ msg: 'User registered successfully' });
    } catch (err) {
      res.status(500).json({ msg: 'Error registering user', error: err });
    }
  });
app.post('/user', async (req, res) => {
    try {
        const {email , password} = req.body
        console.log(email, password)
        const kt = await User.findOne({ email });
        const ktp = await User.findOne({ password });

        if (kt&&ktp) {
            return res.status(201).json(kt);
        }else{
            return res.status(400).json({ message: 'Sai mật khẩu' });
        }
    } catch (e) {
        console.error("Lỗi:", e);
        return res.status(500).send("Lỗi");
    }
});


    app.post('/catalog', async (req, res) => {
        try {
            const { name } = req.body;
                if (!name) {
                return res.status(400).json({ error: "nameCatalog is required" });
            }
    
            const newCatalog = new Catalog({ nameCatalog: name });
            const data = await newCatalog.save();
    
            return res.status(201).json(data);
        } catch (e) {
            console.error("Error adding catalog:", e);
            return res.status(500).send("Error adding catalog");
        }
    });
    
    app.get('/catalog', async (req, res) => {
        try {
            const data = await Catalog.find(); 
            return res.json(data); 
        } catch (e) {
            console.error("Error fetching catalogs:", e);
            return res.status(500).send("Error fetching catalogs");
        }
    });

    app.delete('/catalog', async (req, res) => {
        try {
            const { id } = req.query;
                if (!id) {
                return res.status(400).json({ error: "ID is required" });
            }
                const data = await Catalog.findOneAndDelete({ _id: id });
                if (!data) {
                return res.status(404).json({ error: "Catalog not found" });
            }
    
            return res.json({ message: "Catalog deleted successfully", data });
        } catch (e) {
            console.error("Error deleting catalog:", e);
            return res.status(500).send("Error deleting catalog");
        }
    });
    ///api San Pham
    
    app.get('/product', async (req, res) => {
        try {
            const data = await Vehicle.find(); 
            if(data){
                return res.json(data); 
            }
        } catch (e) {
            console.error("Error fetching vehicles:", e);
            res.status(500).send("Error fetching vehicles");
        }
    });
        
    app.post('/product', async (req, res) => {
        try {
            const { name, category, price, description, img1,img2,img3, date } = req.body;
    
            console.log("Received product data:", name, category, price, description, img1,img2, date);
    
            if (!name || !price || !category) {
                return res.status(400).json({ error: "Name, category, and price are required fields." });
            }
                const newProduct = new Vehicle({
                name,
                category,
                price,
                description,
                img: {
                    img1,
                    img2,
                    img3
                },
                dateAdded: date
            });
    
            const savedProduct = await newProduct.save();
                res.status(201).json({ message: "Product added successfully", product: savedProduct });
        } catch (error) {
            console.error("Error adding product:", error);
            res.status(500).json({ error: "An error occurred while adding the product." });
        }
    });
    app.put('/product/:id', async (req, res) => {
        try {
            const { id } = req.params; // Lấy ID từ params
            const { name, category, price, description, img1, img2, img3, date } = req.body;
    
            console.log("Received update request for product ID:", id);
            console.log("Received updated product data:", name, category, price, description, img1, img2, date);
    
            const updateData = {};
    
            if (name) updateData.name = name;
            if (category) updateData.category = category;
            if (price) updateData.price = price;
            if (description) updateData.description = description;
            if (img1) updateData.img = { ...updateData.img, img1 };
            if (img2) updateData.img = { ...updateData.img, img2 };
            if (img3) updateData.img = { ...updateData.img, img3 };
            if (date) updateData.dateAdded = date;
    
            const updatedProduct = await Vehicle.findOneAndUpdate(
                { id: id }, 
                updateData, 
                { new: true }
            );
    
            if (!updatedProduct) {
                return res.status(404).json({ error: "Product not found." });
            }
    
            res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
    
        } catch (error) {
            console.error("Error updating product:", error);  // Lỗi chi tiết
            res.status(500).json({ error: "An error occurred while updating the product.", details: error.message });
        }
    });
    
    
    app.delete('/product', async (req, res) => {
        try {
            const { id } = req.query;
                if (!id) {
                return res.status(400).json({ error: "ID is required" });
            }
                const data = await Vehicle.findOneAndDelete({ id: id });
                if (!data) {
                return res.status(404).json({ error: "Vehicle not found" });
            }
    
            return res.json({ message: "Vehicle deleted successfully", data });
        } catch (e) {
            console.error("Error deleting Vehicle:", e);
            return res.status(500).send("Error deleting Vehicle");
        }
    });
    
    
/////////////////upload ảnh lên localhost 
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/');
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + path.extname(file.originalname));
        },
    });
    const upload = multer({ storage: storage });

    app.post('/upload', upload.single('image'), (req, res) => {
        console.log(req.file); 
        if (!req.file) {
            return res.status(400).json({ error: 'Không có file nào được tải lên.' });
        }
        res.json({ filePath: `http://localhost:${port}/uploads/${req.file.filename}` });
    });
    


    app.listen(port, () => {
        console.log("Your app is running on port " + port);
    });
};

startServer();