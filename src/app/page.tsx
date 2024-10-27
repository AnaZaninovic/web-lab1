import styles from "./page.module.css";
import {getTicketsCount} from "@/app/actions/getTicketsCount";


export default async function Home() {
    const ticketCount = await getTicketsCount();

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <h1 className={styles.title}>
                    Ulaznica izdano: {ticketCount}
                </h1>
            </main>
        </div>
    );
}
