# Titanic Demo Dataset

In this example, we use partial demo dataset `Titanic` from out product RATH.

| passengerId | survived | pclass | name | sex | age | ticket | parch |
|-------------|----------|--------|--------|------|-----|--------|-------|
| 1 | 0 | 3 | Braund, Mr. Owen Harris | male | 22 | A/5 21171 | 0 |
| 2 | 1 | 1 | Cumings, Mrs. John Bradley (Florence Briggs Thayer) | female | 38 | PC 17599 | 0 |
| 3 | 1 | 3 | Heikkinen, Miss. Laina | female | 26 | STON/O2. 3101282 | 0 |
| 4 | 1 | 1 | Futrelle, Mrs. Jacques Heath (Lily May Peel) | female | 35 | 113803 | 0 |
| 5 | 0 | 3 | Allen, Mr. William Henry | male | 35 | 373450 | 0 |
| 6 | 0 | 1 | McCarthy, Mr. Timothy J | male | 54 | 17463 | 0 |
| 7 | 0 | 3 | Palsson, Master. Gosta Leonard | male | 2 | 349909 | 1 |
| 8 | 1 | 3 | Johnson, Mrs. Oscar W (Elisabeth Vilhelmina Berg) | female | 27 | 349909 | 2 |
| 9 | 1 | 2 | Nasser, Mrs. Nicholas (Adele Achem) | female | 14 | 237736 | 0 |
| 10 | 1 | 2 | Sandstrom, Miss. Marguerite Rut | female | 4 | PP 9549 | 1 |
| 11 | 1 | 3 | Bonnell, Miss. Elizabeth | female | 58 | 113783 | 0 |
| 12 | 0 | 3 | Saundercock, Mr. William Henry | male | 20 | A/5. 2151 | 0 |

The dataset contains the Meta `passengerId`, `survived`, `pclass`, `name`, `sex`, `age`, `ticket` and `parch` \

This example provides interface to query and modify the dataset Meta and parse dsl statement to query database described above

Follow these setup to run the example:

1. Run the server:

   ```console
   cd server/
   go run .
   ```

2. Run the client:

   ```console
   cd client/
   go run .
   ```

