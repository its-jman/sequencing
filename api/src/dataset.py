import os
import time

import utils
from models.record import RecordSchema
from models.dataset import UploadMetaSchema, RecordsMetaSchema


class Dataset:
    ROOT_PATH = "./uploads"
    """
    Control individual datasets. FS Adding, FS deleting, validity, etc.
    """

    def __init__(self, dataset_id):
        self.path = os.path.join(self.ROOT_PATH, dataset_id)
        self.id = dataset_id

        self._upload_meta_path = os.path.join(self.path, "meta.json")
        self._records_path = os.path.join(self.path, "records.json")

        self._upload_meta = None
        self._upload_meta_errors = []
        self._upload_meta_update_time = 0

        self._records_meta = None
        self._records_errors = []
        self._records_update_time = 0

        self.refresh(force_update=True)

    def refresh(self, force_update=False):
        """
        Refresh should proceed as a check of both meta and records validity. It retrieves data from filesystem if need
        be, and updates `self` respectively.

        :return:
        """
        # These should fetch the most recent data. Updating if need be.
        self._refresh_upload_meta(force_update=force_update)
        self._refresh_records_meta(force_update=force_update)

    @property
    def _valid(self):
        """
        Checks the state of the dataset_meta and the records_valid state.
        :return:
        """
        return not (self._upload_meta_errors or self._records_errors)

    @property
    def valid(self):
        """
        Externally visible function that ensures a fresh state.
        :return:
        """
        self.refresh()
        return self._valid

    @property
    def errors(self):
        return {
            "upload_meta": self._upload_meta_errors,
            "records": self._records_errors,
        }

    @property
    def upload_meta(self):
        """
        Load the dataset meta. External functions should get nothing if `self` is not valid.

        :return:
        """
        self.refresh()
        if not self._valid:
            return None
        return self._upload_meta

    @property
    def records_meta(self):
        """
        Load the records meta. External functions should get nothing if `self` is not valid.

        :return:
        """
        self.refresh()
        if not self._valid:
            return None
        return self._records_meta

    def load_records(self):
        """
        Load the records from the filesystem (since they are not cached). External functions should get nothing if
        `self` is not valid.
        :return:
        """
        self.refresh()
        if not self._valid:
            return None
        return self._load_records()

    def _refresh_upload_meta(self, force_update=False):
        """
        Efficient method to get the stored dataset meta (All fields of the dataset meta, excluding `records_meta`).
        Will check if the file has been updated since the last time it was parsed, and return the JSON object of
        (either) the data read from the filesystem, or what was previously read.

        :param force_update: boolean that forces filesystem refresh
        :return:
        """
        updated = force_update or utils.should_update(
            self._upload_meta_path, self._upload_meta_update_time
        )
        if updated:
            self._upload_meta = self._load_upload_meta()

        return self._upload_meta, updated

    def _refresh_records_meta(self, force_update=False):
        """
        Efficient method to get the records meta. Will check if the file has been updated since the last time it was
        parsed, and return the JSON object of (either) the data read from the filesystem, or what was previously read.

        :param force_update: boolean that forces filesystem refresh
        :return:
        """
        updated = force_update or utils.should_update(
            self._records_path, self._records_update_time
        )
        if updated:
            records = self._load_records()
            self._records_meta = RecordsMetaSchema.from_records(records)

        return self._records_meta, updated

    def _load_upload_meta(self):
        """
        Access the raw file. Will update relevant info such as update time and validity, and then will return
        the parsed schema.

        :return:
        """
        self._upload_meta_update_time = time.time()
        upload_meta, errors = utils.parse_schema_file(
            UploadMetaSchema(), self._upload_meta_path
        )

        self._upload_meta_errors = errors
        # Add error if no errors were given.
        if upload_meta is None and not errors:
            self._upload_meta_errors.append("Upload Meta is invalid.")

        return upload_meta

    def _load_records(self):
        """
        Access the raw file. Will update relevant info such as update time and validity, and then will return
        the parsed schema.

        :return:
        """
        self._records_update_time = time.time()
        records, errors = utils.parse_schema_file(
            RecordSchema(many=True), self._records_path
        )

        self._records_errors = errors
        # Add error if no errors were given.
        if records is None and not errors:
            self._records_errors.append("Records are invalid.")

        return records

    def delete(self):
        """
        Deletes dataset from disk. If there are files left in the folder (that were not created by this program), the
        files will remain and the folder will not be deleted.

        :return:
        """
        if os.path.exists(self._upload_meta_path):
            os.remove(self._upload_meta_path)
        if os.path.exists(self._records_path):
            os.remove(self._records_path)

        if not os.listdir(self.path):
            os.rmdir(self.path)
        else:
            print(
                "When attempting to delete dataset [%s] it's folder was not empty. [%s] will not be fully removed."
            )
