// Nationality name banks for the fake name generator. Each set has male (m)
// and female (f) first names plus a shared surname list (last). All fictional,
// commonly-occurring given/family names per culture — no real individuals.
// Kept in its own module so a page importing one nationality tree-shakes the rest.

export interface NameSet {
  label: string;
  m: readonly string[];
  f: readonly string[];
  last: readonly string[];
}

export const NAME_SETS: Record<string, NameSet> = {
  american: {
    label: 'American (English)',
    m: ['James', 'John', 'Robert', 'Michael', 'William', 'David', 'Joseph', 'Charles', 'Daniel', 'Matthew', 'Anthony', 'Mark', 'Andrew', 'Joshua', 'Kevin', 'Brian', 'Ryan', 'Jacob', 'Eric', 'Justin'],
    f: ['Mary', 'Jennifer', 'Linda', 'Elizabeth', 'Susan', 'Jessica', 'Sarah', 'Karen', 'Lisa', 'Nancy', 'Ashley', 'Emily', 'Michelle', 'Amanda', 'Melissa', 'Rebecca', 'Laura', 'Amy', 'Nicole', 'Samantha'],
    last: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Wilson', 'Anderson', 'Taylor', 'Thomas', 'Moore', 'Jackson', 'Martin', 'Lee', 'Thompson', 'White', 'Harris', 'Clark', 'Lewis', 'Walker', 'Hall'],
  },
  british: {
    label: 'British',
    m: ['Oliver', 'Harry', 'George', 'Jack', 'Charlie', 'Thomas', 'Oscar', 'William', 'James', 'Henry', 'Alfie', 'Freddie', 'Archie', 'Arthur', 'Edward', 'Alexander', 'Samuel', 'Louis', 'Max', 'Benjamin'],
    f: ['Olivia', 'Amelia', 'Isla', 'Emily', 'Ava', 'Sophia', 'Grace', 'Poppy', 'Charlotte', 'Ella', 'Freya', 'Lily', 'Florence', 'Alice', 'Evie', 'Sophie', 'Isabella', 'Millie', 'Rosie', 'Daisy'],
    last: ['Smith', 'Jones', 'Taylor', 'Brown', 'Williams', 'Wilson', 'Johnson', 'Davies', 'Robinson', 'Wright', 'Thompson', 'Evans', 'Walker', 'White', 'Roberts', 'Green', 'Hall', 'Wood', 'Jackson', 'Clarke', 'Hughes', 'Turner'],
  },
  italian: {
    label: 'Italian',
    m: ['Leonardo', 'Francesco', 'Alessandro', 'Lorenzo', 'Mattia', 'Andrea', 'Gabriele', 'Riccardo', 'Tommaso', 'Marco', 'Giuseppe', 'Antonio', 'Matteo', 'Federico', 'Stefano', 'Davide', 'Luca', 'Giovanni', 'Simone', 'Nicola'],
    f: ['Sofia', 'Giulia', 'Aurora', 'Alice', 'Ginevra', 'Emma', 'Giorgia', 'Greta', 'Martina', 'Chiara', 'Francesca', 'Anna', 'Sara', 'Elena', 'Valentina', 'Beatrice', 'Alessia', 'Gaia', 'Ludovica', 'Noemi'],
    last: ['Rossi', 'Russo', 'Ferrari', 'Esposito', 'Bianchi', 'Romano', 'Colombo', 'Ricci', 'Marino', 'Greco', 'Bruno', 'Gallo', 'Conti', 'De Luca', 'Costa', 'Giordano', 'Mancini', 'Rizzo', 'Lombardi', 'Moretti', 'Barbieri', 'Fontana'],
  },
  spanish: {
    label: 'Spanish / Hispanic',
    m: ['Alejandro', 'Daniel', 'Pablo', 'Hugo', 'Álvaro', 'Adrián', 'David', 'Diego', 'Javier', 'Mateo', 'Carlos', 'Sergio', 'Manuel', 'Miguel', 'Antonio', 'Juan', 'Marcos', 'Iker', 'Lucas', 'Gonzalo'],
    f: ['Lucía', 'María', 'Paula', 'Daniela', 'Sofía', 'Martina', 'Valeria', 'Carla', 'Alba', 'Julia', 'Sara', 'Carmen', 'Elena', 'Ana', 'Laura', 'Marta', 'Claudia', 'Noa', 'Irene', 'Natalia'],
    last: ['García', 'Martínez', 'López', 'Sánchez', 'González', 'Rodríguez', 'Fernández', 'Pérez', 'Gómez', 'Martín', 'Jiménez', 'Ruiz', 'Hernández', 'Díaz', 'Moreno', 'Álvarez', 'Romero', 'Torres', 'Navarro', 'Ramos', 'Gil', 'Serrano'],
  },
  french: {
    label: 'French',
    m: ['Gabriel', 'Léo', 'Raphaël', 'Arthur', 'Louis', 'Lucas', 'Adam', 'Jules', 'Hugo', 'Maël', 'Liam', 'Nathan', 'Ethan', 'Paul', 'Antoine', 'Théo', 'Nolan', 'Sacha', 'Victor', 'Mathis'],
    f: ['Emma', 'Jade', 'Louise', 'Alice', 'Chloé', 'Lina', 'Léa', 'Rose', 'Anna', 'Mila', 'Julia', 'Inès', 'Ambre', 'Manon', 'Camille', 'Zoé', 'Sarah', 'Juliette', 'Nina', 'Léna'],
    last: ['Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit', 'Durand', 'Leroy', 'Moreau', 'Simon', 'Laurent', 'Lefebvre', 'Michel', 'Garcia', 'David', 'Bertrand', 'Roux', 'Vincent', 'Fournier', 'Morel', 'Girard'],
  },
  german: {
    label: 'German',
    m: ['Ben', 'Paul', 'Leon', 'Finn', 'Elias', 'Jonas', 'Luca', 'Noah', 'Louis', 'Felix', 'Maximilian', 'Henry', 'Emil', 'Anton', 'Jakob', 'Moritz', 'Julian', 'David', 'Lukas', 'Oskar'],
    f: ['Emilia', 'Hannah', 'Mia', 'Emma', 'Sophia', 'Lina', 'Mila', 'Ella', 'Klara', 'Lea', 'Marie', 'Lena', 'Anna', 'Leonie', 'Amelie', 'Frieda', 'Ida', 'Charlotte', 'Johanna', 'Greta'],
    last: ['Müller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Wagner', 'Becker', 'Schulz', 'Hoffmann', 'Koch', 'Bauer', 'Richter', 'Klein', 'Wolf', 'Schröder', 'Neumann', 'Schwarz', 'Zimmermann', 'Braun', 'Krüger', 'Hofmann'],
  },
  scandinavian: {
    label: 'Scandinavian',
    m: ['William', 'Noah', 'Oliver', 'Lucas', 'Liam', 'Elias', 'Oscar', 'Emil', 'Filip', 'Isak', 'Aksel', 'Henrik', 'Mathias', 'Magnus', 'Sander', 'Jakob', 'Erik', 'Kasper', 'Viktor', 'Alfred'],
    f: ['Emma', 'Nora', 'Ella', 'Maja', 'Olivia', 'Sofia', 'Alice', 'Ingrid', 'Freja', 'Astrid', 'Wilma', 'Ebba', 'Alma', 'Signe', 'Lea', 'Josefine', 'Sara', 'Elin', 'Agnes', 'Thea'],
    last: ['Johansson', 'Andersson', 'Karlsson', 'Nilsson', 'Eriksson', 'Larsson', 'Olsson', 'Persson', 'Svensson', 'Gustafsson', 'Hansen', 'Johansen', 'Olsen', 'Larsen', 'Andersen', 'Pedersen', 'Nielsen', 'Kristiansen', 'Jensen', 'Berg', 'Lindberg', 'Holm'],
  },
  dutch: {
    label: 'Dutch',
    m: ['Daan', 'Sem', 'Milan', 'Levi', 'Luuk', 'Bram', 'Finn', 'Noud', 'Lucas', 'Jesse', 'Sam', 'Thijs', 'Gijs', 'Teun', 'Ruben', 'Julian', 'Mees', 'Stijn', 'Lars', 'Thomas'],
    f: ['Emma', 'Julia', 'Mila', 'Tess', 'Sophie', 'Zoë', 'Sara', 'Nova', 'Yara', 'Anna', 'Eva', 'Fenna', 'Lotte', 'Noor', 'Liv', 'Saar', 'Roos', 'Lisa', 'Fleur', 'Elin'],
    last: ['De Jong', 'Jansen', 'De Vries', 'Van den Berg', 'Van Dijk', 'Bakker', 'Janssen', 'Visser', 'Smit', 'Meijer', 'De Boer', 'Mulder', 'De Groot', 'Bos', 'Vos', 'Peters', 'Hendriks', 'Van Leeuwen', 'Dekker', 'Brouwer', 'De Wit', 'Dijkstra'],
  },
  japanese: {
    label: 'Japanese',
    m: ['Haruto', 'Yuto', 'Sota', 'Yuki', 'Hayato', 'Haruki', 'Ryusei', 'Koki', 'Sora', 'Riku', 'Ren', 'Daiki', 'Kaito', 'Takumi', 'Kenta', 'Hiroto', 'Yamato', 'Shota', 'Tatsuki', 'Itsuki'],
    f: ['Yui', 'Aoi', 'Rin', 'Hina', 'Yuna', 'Sakura', 'Mei', 'Koharu', 'Akari', 'Hana', 'Miu', 'Saki', 'Yuina', 'Ichika', 'Riko', 'Mio', 'Kaede', 'Nanami', 'Honoka', 'Ema'],
    last: ['Sato', 'Suzuki', 'Takahashi', 'Tanaka', 'Watanabe', 'Ito', 'Yamamoto', 'Nakamura', 'Kobayashi', 'Kato', 'Yoshida', 'Yamada', 'Sasaki', 'Yamaguchi', 'Matsumoto', 'Inoue', 'Kimura', 'Hayashi', 'Shimizu', 'Saito', 'Mori', 'Abe'],
  },
  chinese: {
    label: 'Chinese',
    m: ['Wei', 'Hao', 'Lei', 'Jun', 'Ming', 'Yong', 'Jie', 'Bin', 'Tao', 'Peng', 'Chao', 'Gang', 'Feng', 'Kai', 'Long', 'Xin', 'Yang', 'Bo', 'Cheng', 'Hui'],
    f: ['Fang', 'Jing', 'Li', 'Na', 'Min', 'Yan', 'Xin', 'Ying', 'Hui', 'Juan', 'Mei', 'Ping', 'Lan', 'Xia', 'Hong', 'Lin', 'Qing', 'Yun', 'Ling', 'Xiu'],
    last: ['Wang', 'Li', 'Zhang', 'Liu', 'Chen', 'Yang', 'Huang', 'Zhao', 'Wu', 'Zhou', 'Xu', 'Sun', 'Ma', 'Zhu', 'Hu', 'Guo', 'He', 'Gao', 'Lin', 'Luo', 'Zheng', 'Liang'],
  },
  indian: {
    label: 'Indian',
    m: ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan', 'Rohan', 'Karan', 'Rahul', 'Aryan', 'Kabir', 'Dhruv', 'Ansh', 'Yash', 'Rudra', 'Advik'],
    f: ['Aadhya', 'Ananya', 'Diya', 'Saanvi', 'Aanya', 'Pari', 'Anika', 'Navya', 'Riya', 'Myra', 'Sara', 'Ira', 'Kiara', 'Aarohi', 'Priya', 'Ishita', 'Meera', 'Tara', 'Nisha', 'Kavya'],
    last: ['Sharma', 'Verma', 'Gupta', 'Singh', 'Kumar', 'Patel', 'Reddy', 'Nair', 'Iyer', 'Rao', 'Das', 'Bose', 'Mehta', 'Kapoor', 'Chopra', 'Malhotra', 'Joshi', 'Menon', 'Pillai', 'Agarwal', 'Banerjee', 'Chauhan'],
  },
  arabic: {
    label: 'Arabic',
    m: ['Mohammed', 'Ahmed', 'Ali', 'Omar', 'Youssef', 'Ibrahim', 'Hassan', 'Khaled', 'Karim', 'Tariq', 'Zayd', 'Bilal', 'Yusuf', 'Amir', 'Faris', 'Rayan', 'Hamza', 'Adam', 'Nour', 'Sami'],
    f: ['Fatima', 'Aisha', 'Maryam', 'Layla', 'Sara', 'Noor', 'Yasmin', 'Huda', 'Amira', 'Salma', 'Zaynab', 'Hana', 'Lina', 'Rania', 'Dina', 'Nadia', 'Farah', 'Reem', 'Malak', 'Jana'],
    last: ['Al-Sayed', 'Hassan', 'Ali', 'Ibrahim', 'Khalil', 'Mansour', 'Haddad', 'Nasser', 'Saleh', 'Aziz', 'Rahman', 'Farouk', 'Karim', 'Younes', 'Darwish', 'Habib', 'Najjar', 'Sabbagh', 'Kassab', 'Bishara', 'Toma', 'Sultan'],
  },
  russian: {
    label: 'Russian / Slavic',
    m: ['Alexander', 'Dmitri', 'Maxim', 'Ivan', 'Artyom', 'Nikita', 'Mikhail', 'Andrei', 'Sergei', 'Roman', 'Kirill', 'Egor', 'Vladimir', 'Pavel', 'Denis', 'Alexei', 'Anton', 'Yuri', 'Boris', 'Igor'],
    f: ['Anastasia', 'Maria', 'Daria', 'Anna', 'Elena', 'Sofia', 'Polina', 'Victoria', 'Ekaterina', 'Olga', 'Natalia', 'Irina', 'Yulia', 'Ksenia', 'Alina', 'Vera', 'Tatiana', 'Svetlana', 'Nadia', 'Larisa'],
    last: ['Ivanov', 'Smirnov', 'Kuznetsov', 'Popov', 'Vasiliev', 'Petrov', 'Sokolov', 'Mikhailov', 'Novikov', 'Fedorov', 'Morozov', 'Volkov', 'Alekseev', 'Lebedev', 'Semenov', 'Egorov', 'Pavlov', 'Kozlov', 'Stepanov', 'Nikolaev', 'Orlov', 'Andreev'],
  },
};

export type NameSetKey = keyof typeof NAME_SETS;

export const NAME_SET_KEYS = Object.keys(NAME_SETS) as NameSetKey[];
